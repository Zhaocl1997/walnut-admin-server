import { AppConstPublicMeta } from '@/const/decorator/public';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(AppConstPublicMeta.PUBLIC, true);
