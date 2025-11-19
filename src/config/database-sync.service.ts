import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../modules/users/user.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DatabaseSyncService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSyncService.name);

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async onModuleInit() {
    try {
      this.logger.log('🔄 Starting database synchronization...');

      // Get Sequelize instance
      const sequelize = this.userModel.sequelize as Sequelize;

      if (!sequelize) {
        this.logger.warn('⚠️ Sequelize instance not found');
        return;
      }

      // Sync User model với alter: true để cập nhật schema
      await this.userModel.sync({ alter: true });

      this.logger.log('✅ Database synchronization completed successfully!');
      this.logger.log('✅ User model schema has been updated');
    } catch (error) {
      this.logger.error('❌ Error during database synchronization:', error);
      // Không throw error để app vẫn có thể start, nhưng log để biết
    }
  }
}
