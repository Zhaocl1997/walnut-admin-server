import { FilterQuery, Model, PipelineStage, UpdateQuery } from 'mongoose';
import { WalnutAbstractModel } from '../model/base.model';
import {
  WalnutGetAggregateParams,
  WalnutGetListParams,
} from '../../utils/listParams';
import {
  WalnutExceptionDataDeleteError,
  WalnutExceptionDataExisted,
  WalnutExceptionDataNotFound,
} from '../../exceptions/bussiness/data';
import { WalnutAbstractDTO } from '../dto/base.dto';
import { WalnutListRequestDTO, WalnutListResponseDTO } from '../dto/list.dto';
import { WalnutAbstractEntity } from '../entity/base.entity';

export abstract class WalnutAbstractRepository<
  WDocument extends WalnutAbstractModel,
  DTO extends WalnutAbstractDTO,
  Entity extends WalnutAbstractEntity,
> {
  constructor(
    private readonly WalnutModel: Model<WDocument>,
    private readonly WalnutEntity?: any,
    private readonly uniqueKey?: keyof DTO | (keyof DTO)[] | undefined,
  ) {}

  /**
   * @description: check unique key existence
   */
  public async isExistByUniqueKey(dto: DTO | Partial<DTO>) {
    if (!this.uniqueKey) {
      return false;
    }

    if (typeof this.uniqueKey === 'string') {
      if (!dto[this.uniqueKey]) {
        return false;
      }

      if (dto._id) {
        return await this.WalnutModel.exists({
          _id: { $ne: dto._id },
          [this.uniqueKey]: dto[this.uniqueKey],
          deleted: false,
        } as FilterQuery<DTO>);
      } else {
        return await this.WalnutModel.exists({
          [this.uniqueKey]: dto[this.uniqueKey],
          deleted: false,
        } as FilterQuery<DTO>);
      }
    }

    if (Array.isArray(this.uniqueKey)) {
      {
        if (dto._id) {
          const arr = await Promise.all(
            this.uniqueKey.map((key) => {
              if (!dto[key]) {
                return null;
              }

              return this.WalnutModel.exists({
                _id: { $ne: dto._id },
                [key]: dto[key],
                deleted: false,
              } as FilterQuery<DTO>);
            }),
          );

          return arr.some((i) => i !== null);
        } else {
          const arr = await Promise.all(
            this.uniqueKey.map((key) => {
              if (!dto[key]) {
                return null;
              }

              return this.WalnutModel.exists({
                [key]: dto[key],
                deleted: false,
              } as FilterQuery<DTO>);
            }),
          );

          return arr.some((i) => i !== null);
        }
      }
    }
  }

  /**
   * @description: Base create repo, provide a unique key as second param
   */
  public async create(
    dto: DTO | Partial<DTO>,
    needEntity = true,
  ): Promise<WDocument> {
    if (await this.isExistByUniqueKey(dto)) {
      throw new WalnutExceptionDataExisted(
        typeof this.uniqueKey === 'string'
          ? this.uniqueKey
          : (this.uniqueKey as string[]).join(', '),
      );
    }

    const created = await this.WalnutModel.create(dto);

    await created.save();

    if (needEntity) {
      return new this.WalnutEntity(created.toJSON());
    } else {
      return created;
    }
  }

  /**
   * @description: Base readById repo
   */
  public async readById(_id: string): Promise<Entity> {
    const read = await this.WalnutModel.findById({
      _id,
      deleted: false,
    }).lean();

    if (!read) {
      throw new WalnutExceptionDataNotFound();
    }

    return new this.WalnutEntity(read);
  }

  /**
   * @description: Base readById repo
   */
  public async readByCondition(condition: Partial<DTO>): Promise<WDocument> {
    return await this.WalnutModel.findOne({
      ...condition,
      deleted: false,
    });
  }

  /**
   * @description: Base update repo
   */
  public async update(dto: DTO | Partial<DTO>): Promise<Entity> {
    if (await this.isExistByUniqueKey(dto)) {
      throw new WalnutExceptionDataExisted(
        typeof this.uniqueKey === 'string'
          ? this.uniqueKey
          : (this.uniqueKey as string[]).join(', '),
      );
    }

    const updated = await this.WalnutModel.findOneAndUpdate(
      {
        _id: dto._id,
        deleted: false,
      } as FilterQuery<DTO>,
      dto,
      { new: true },
    ).lean();

    if (!updated) {
      throw new WalnutExceptionDataNotFound();
    }

    return new this.WalnutEntity(updated);
  }

  /**
   * @description: Base delete repo
   */
  public async delete(_id: string): Promise<Entity> {
    const deleted = await this.WalnutModel.findOne({ _id, deleted: false });

    if (!deleted) {
      throw new WalnutExceptionDataNotFound();
    }

    deleted.deleted = true;

    await deleted.save();

    return new this.WalnutEntity(deleted.toObject());
  }

  /**
   * @description: Base delete many repo
   */
  public async deleteMany(ids: string): Promise<Entity[]> {
    const idArr = ids.split(',');

    const deleteds = await this.WalnutModel.find({
      _id: { $in: idArr },
      deleted: false,
    });

    if (deleteds.length !== idArr.length) {
      throw new WalnutExceptionDataDeleteError();
    }

    deleteds.forEach((d) => {
      d.deleted = true;
    });

    await Promise.all(deleteds.map((d) => d.save()));

    return deleteds.map((i) => new this.WalnutEntity(i.toJSON()));
  }

  /**
   * @description: Base list, with default pattern params
   */
  public async list(
    params: WalnutListRequestDTO<DTO>,
    extraPipeline: PipelineStage.FacetPipelineStage[] = [],
  ): Promise<WalnutListResponseDTO<DTO>> {
    // get params
    const baseParams = WalnutGetListParams<DTO>(params);

    // get aggregate params througn baseParams
    const { dataParams, totalParams } = WalnutGetAggregateParams(
      baseParams,
      extraPipeline,
    );

    const data = await this.WalnutModel.aggregate<DTO>(dataParams);

    const total = await this.WalnutModel.aggregate<
      Pick<IWalnutResponseListData, 'total'>
    >(totalParams);

    return {
      total: total.length !== 0 ? total[0].total : 0,
      data: data.map((i) => new this.WalnutEntity(i)),
    };
  }
}
