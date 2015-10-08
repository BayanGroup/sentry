from __future__ import absolute_import

import pytz

from datetime import (
    datetime,
    timedelta,
)

from django.conf import settings
from sentry.testutils import TestCase
from sentry.tsdb.base import TSDBModel, ONE_MINUTE, ONE_HOUR, ONE_DAY
from sentry.tsdb.redis import RedisTSDB


class RedisTSDBTest(TestCase):
    def setUp(self):
        options = settings.SENTRY_REDIS_OPTIONS
        self.db = RedisTSDB(hosts=options['hosts'], rollups=(
            # time in seconds, samples to keep
            (10, 30),  # 5 minutes at 10 seconds
            (ONE_MINUTE, 120),  # 2 hours at 1 minute
            (ONE_HOUR, 24),  # 1 days at 1 hour
            (ONE_DAY, 30),  # 30 days at 1 day
        ), vnodes=64)

        with self.db.cluster.all() as client:
            client.flushdb()

    def test_make_key(self):
        result = self.db.make_key(TSDBModel.project, 1368889980, 1)
        assert result == 'ts:1:1368889980:1'

        result = self.db.make_key(TSDBModel.project, 1368889980, 'foo')
        assert result == 'ts:1:1368889980:33'

    def test_get_model_key(self):
        result = self.db.get_model_key(1)
        assert result == 1

        result = self.db.get_model_key('foo')
        assert result == 'bf4e529197e56a48ae2737505b9736e4'

    def test_simple(self):
        now = datetime.utcnow().replace(tzinfo=pytz.UTC)
        dts = [now + timedelta(hours=i) for i in xrange(4)]

        def timestamp(d):
            t = int(d.strftime('%s'))
            return t - (t % 3600)

        self.db.incr(TSDBModel.project, 1, dts[0])
        self.db.incr(TSDBModel.project, 1, dts[1], count=3)
        self.db.incr(TSDBModel.project, 1, dts[2])
        self.db.incr_multi([
            (TSDBModel.project, 1),
            (TSDBModel.project, 2),
        ], dts[3], count=4)

        results = self.db.get_range(TSDBModel.project, [1], dts[0], dts[-1])
        assert results == {
            1: [
                (timestamp(dts[0]), 1),
                (timestamp(dts[1]), 3),
                (timestamp(dts[2]), 1),
                (timestamp(dts[3]), 4),
            ],
        }
        results = self.db.get_range(TSDBModel.project, [2], dts[0], dts[-1])
        assert results == {
            2: [
                (timestamp(dts[0]), 0),
                (timestamp(dts[1]), 0),
                (timestamp(dts[2]), 0),
                (timestamp(dts[3]), 4),
            ],
        }

        results = self.db.get_sums(TSDBModel.project, [1, 2], dts[0], dts[-1])
        assert results == {
            1: 9,
            2: 4,
        }
