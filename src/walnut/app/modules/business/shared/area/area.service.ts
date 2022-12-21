import { Injectable } from '@nestjs/common';
import { arrToTree, formatTree } from 'easy-fns-ts/dist/lib';
import {
  cloneDeep,
  omit,
  merge,
  uniqWith,
  isEqual,
  keyBy,
  values,
  groupBy,
} from 'lodash';
import { Model } from 'mongoose';

import { SharedAreaModel, SharedAreaDocument } from './schema/area.schema';
import { AppConstCacheKeys, AppConstCacheType } from '@/const/app/cache';
import { AppInjectModel } from '@/database/database.decorator';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';

@Injectable()
export class SharedAreaService {
  constructor(
    private readonly cacheManager: AppCacheService,
    @AppInjectModel(SharedAreaModel.name)
    private readonly SharedAreaModel: Model<SharedAreaDocument>,
  ) {}

  /**
   * @description get cache key by pcode
   */
  private getCacheKeyByPcode(pcode: string) {
    const obj = {
      '1': AppConstCacheKeys.PROVINCE,
      '2': AppConstCacheKeys.CITY,
      '4': AppConstCacheKeys.AREA,
      '6': AppConstCacheKeys.STREET,
      '9': AppConstCacheKeys.VILLAGE,
    };

    return obj[pcode.length];
  }

  /**
   * @description get area same level data by code, use cache
   */
  async getSameLevelByCodeWithCache(code: string) {
    if (!code) return;

    const target = await this.SharedAreaModel.findOne({ code });

    if (!target) return;

    return this.getChildrenByPcodeWithCache(target.pcode);
  }

  /**
   * @description get area children by pcode, use cache
   */
  async getChildrenByPcodeWithCache(pcode: string = '0') {
    const CACHE_KEY = this.getCacheKeyByPcode(pcode);

    const cachedData = await this.cacheManager.get<SharedAreaModel[]>(
      CACHE_KEY,
    );

    // no cache, find, set and return
    if (!cachedData) {
      const res = await this.SharedAreaModel.find({ pcode })
        .select('-_id name code pcode')
        .lean();

      await this.cacheManager.set(CACHE_KEY, res, { t: AppConstCacheType.AREA });

      return res;
    }

    // got cache data, but do not got wanted data
    // also need to find, and concat to cache data
    // finally set and return
    if (!cachedData.some((i) => i.pcode === pcode)) {
      const res = await this.SharedAreaModel.find({ pcode })
        .select('-_id name code pcode')
        .lean();

      await this.cacheManager.set(CACHE_KEY, cachedData.concat(res as any), {
        t: AppConstCacheType.AREA,
      });

      return res;
    }

    // if code excute to this step, it means what is wanted are already in cache
    // just filter and return
    return cloneDeep(cachedData.filter((i) => i.pcode === pcode));
  }

  /**
   * @description feedback by code, use cache
   */
  async feedback(code: string) {
    // level 2
    if (code.length === 4) {
      const level2 = await this.getSameLevelByCodeWithCache(code);

      return level2.map((i) => ({ ...i, depth: 1, isLeaf: true }));
    }

    // level 3
    if (code.length === 6) {
      const level3 = await this.getSameLevelByCodeWithCache(code);

      if (!level3) return [];

      const level2 = await this.getSameLevelByCodeWithCache(level3[0].pcode);

      return formatTree(
        arrToTree([...level3, ...level2], {
          id: 'code',
          pid: 'pcode',
        }),
        {
          format: (node) =>
            node.code.length === 6
              ? Object.assign(node, { depth: 2, isLeaf: true })
              : node.code.length === 4
              ? Object.assign(omit(node, 'children'), {
                  depth: 1,
                  isLeaf: false,
                })
              : node,
        },
      );
    }

    // level 4
    if (code.length === 9) {
      const level4 = await this.getSameLevelByCodeWithCache(code);

      if (!level4) return [];

      const level3 = await this.getSameLevelByCodeWithCache(level4[0].pcode);

      const level2 = await this.getSameLevelByCodeWithCache(level3[0].pcode);

      return formatTree(
        arrToTree([...level4, ...level3, ...level2], {
          id: 'code',
          pid: 'pcode',
        }),
        {
          format: (node) =>
            node.code.length === 9
              ? Object.assign(node, { depth: 3, isLeaf: true })
              : node.code.length === 6
              ? Object.assign(omit(node, 'children'), {
                  depth: 2,
                  isLeaf: false,
                })
              : node.code.length === 4
              ? Object.assign(omit(node, 'children'), {
                  depth: 1,
                  isLeaf: false,
                })
              : node,
        },
      );
    }

    // level 5
    if (code.length === 12) {
      const level5 = await this.getSameLevelByCodeWithCache(code);

      if (!level5) return [];

      const level4 = await this.getSameLevelByCodeWithCache(level5[0].pcode);

      const level3 = await this.getSameLevelByCodeWithCache(level4[0].pcode);

      const level2 = await this.getSameLevelByCodeWithCache(level3[0].pcode);

      return formatTree(
        arrToTree([...level5, ...level4, ...level3, ...level2], {
          id: 'code',
          pid: 'pcode',
        }),
        {
          format: (node) =>
            node.code.length === 12
              ? Object.assign(node, { depth: 4, isLeaf: true })
              : node.code.length === 9
              ? Object.assign(omit(node, 'children'), {
                  depth: 3,
                  isLeaf: false,
                })
              : node.code.length === 6
              ? Object.assign(omit(node, 'children'), {
                  depth: 2,
                  isLeaf: false,
                })
              : node.code.length === 4
              ? Object.assign(omit(node, 'children'), {
                  depth: 1,
                  isLeaf: false,
                })
              : node,
        },
      );
    }

    return [];
  }

  /**
   * @description feedback by codes, seperate with comma, use cache
   */
  async feedbackMultuple(codes: string) {
    const arr = codes.split(',');

    const feedbacks = await Promise.all(arr.map((i) => this.feedback(i)));

    // first remove same array use `uniqWith` and `isEqual`
    return values(
      groupBy(
        uniqWith(feedbacks, isEqual).reduce(
          (prev, curr) =>
            values(merge(keyBy(prev, 'code'), keyBy(curr, 'code'))),
          [],
        ),
        'pcode',
      ),
    );
  }
}
