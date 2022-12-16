import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { AppConstSettingKeysType } from '@/const/app/cache';
import { AppConstFunctionalMeta } from '@/const/decorator/functional';
import { FunctionalGuard } from '@/guard/functional.guard';

export const FunctionalCheck = (setting: AppConstSettingKeysType) => {
  return applyDecorators(
    SetMetadata(AppConstFunctionalMeta.SETTING, setting),
    UseGuards(FunctionalGuard),
  );
};
