import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../../../database/data-source';
import { UserEntity } from '../../../modules/users/persistence/users/user.entity';
import { UserRole } from '../../../modules/users/persistence/users/user-role.enum';

async function seedAdmin() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(UserEntity);

  const adminEmail = 'admin@secondhandet.com';
  const adminPassword = 'P@ssw0rd';

  const existing = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log(`Admin already exists: ${adminEmail}`);
    await AppDataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = userRepository.create({
    fullName: 'System Admin',
    email: adminEmail,
    phone: '0921212121',
    passwordHash,
    isVerified: true,
    role: UserRole.ADMIN,
  });

  await userRepository.save(admin);

  console.log(`Admin user created: ${adminEmail}`);
  console.log(`Password: ${adminPassword} (change this after first login)`);

  await AppDataSource.destroy();
}

seedAdmin().catch((err) => {
  console.error('Failed to seed admin:', err);
  process.exit(1);
});
