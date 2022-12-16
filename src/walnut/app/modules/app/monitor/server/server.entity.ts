import { WalnutAbstractEntity } from '@/common/entity/base.entity';
import {
  TransformToFormattedTime,
  TransformToGHz,
  TransformMbitsToMBs,
  TransformToMWH,
  TransformToPercentage,
  TransformSecondsToHours,
  TransformSizeToGB,
  TransformToVoltage,
} from '@/decorators/transform.decorator';

export class AppMonitorServerEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<AppMonitorServerEntity>) {
    super();
    Object.assign(this, partial);
  }

  @TransformToGHz()
  speed: number;

  @TransformMbitsToMBs()
  netSpeed: number

  @TransformSizeToGB()
  total: number;

  @TransformSizeToGB()
  free: number;

  @TransformSizeToGB()
  used: number;

  @TransformSizeToGB()
  available: number;

  @TransformSizeToGB()
  size: number;

  @TransformToVoltage()
  voltage: number;

  @TransformToMWH()
  designedCapacity: number;

  @TransformToMWH()
  currentCapacity: number;

  @TransformToPercentage()
  percent: number;

  @TransformToFormattedTime()
  current: number;

  @TransformSecondsToHours()
  uptime: number;
}
