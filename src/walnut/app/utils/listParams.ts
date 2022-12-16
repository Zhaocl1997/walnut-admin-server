import { isValidObjectId, PipelineStage, Types } from 'mongoose';
import { WalnutListRequestDTO } from '../common/dto/list.dto';

export interface WalnutListParmsReturn {
  match: AnyObject;
  sorts: Record<string, 1 | -1 | { $meta: 'textScore' }>;
  skip: number;
  limit: number;
}

/**
 * @description handle list params
 */
export const WalnutGetListParams = <T>(
  params: WalnutListRequestDTO<T>,
  extraMatch: Record<string, any> = {},
): WalnutListParmsReturn => {
  if (!params || Object.keys(params).length === 0) {
    return {
      match: { deleted: false, ...extraMatch },
      sorts: null,
      skip: null,
      limit: null,
    };
  }

  const { query, sort, page } = params;

  let match: Record<string, any> = { deleted: false, ...extraMatch };
  let sorts: Record<string, any> = { order: 1, createdAt: -1 };

  // handle query
  if (
    query &&
    Object.values(query).filter((i) => !['', undefined, null].includes(i))
      .length !== 0
  ) {
    Object.entries(query).map(([key, value]) => {
      if (typeof value === 'string') {
        match[key] = { $regex: value, $options: 'i' };
      }

      if (typeof value === 'boolean') {
        match[key] = value;
      }

      if (Array.isArray(value)) {
        value.map((v) => {
          if (new Date(v).getTime() > 0) {
            match[key] = { $gte: new Date(value[0]), $lt: new Date(value[1]) };
          } else {
            match[key] = { $in: value };
          }
        });
      }

      if (isValidObjectId(value)) {
        match[key] = new Types.ObjectId(value);
      }
    });
  }

  // handle sorts
  if (sort && sort.length !== 0) {
    sorts = Object.fromEntries(
      sort
        .sort((a, b) => b.priority - a.priority)
        .map((i) => {
          if (i.order !== false) {
            return [i.field, i.order === 'ascend' ? 1 : -1];
          }
          return [];
        })
        .filter((i) => i.length !== 0),
    );

    // sorts is empty object which means no sortOrder is passed in
    if (Object.keys(sorts).length === 0) {
      sorts = { order: 1, createdAt: -1 };
    }
  }

  // handle page
  const skip = (+page.page - 1) * +page.pageSize;
  const limit = +page.pageSize;

  return { match, sorts, skip, limit };
};

/**
 * @description handle aggregate params
 */
export const WalnutGetAggregateParams = (
  { match, sorts, skip, limit }: WalnutListParmsReturn,
  extraPipeline: PipelineStage.FacetPipelineStage[] = [],
) => {
  const params: PipelineStage.FacetPipelineStage[] = [{ $match: match }];

  if (sorts) {
    params.push({ $sort: sorts });
  }

  if (skip) {
    params.push({ $skip: skip });
  }

  if (limit) {
    params.push({ $limit: limit });
  }

  return {
    dataParams: [...params, ...extraPipeline],
    totalParams: [
      {
        $match: match,
      },
      {
        $count: 'total',
      },
    ],
  };
};
