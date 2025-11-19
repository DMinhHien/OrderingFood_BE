import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './address.model';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address)
    private addressModel: typeof Address,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    return this.addressModel.create({
      ...createAddressDto,
      isDefault: createAddressDto.isDefault ?? false,
      isActive: createAddressDto.isActive ?? true,
    } as any);
  }

  async findAll(): Promise<Address[]> {
    return this.addressModel.findAll({
      where: { isActive: true },
    });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressModel.findOne({
      where: { id, isActive: true },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findOne(id);
    await address.update(updateAddressDto);
    return address.reload();
  }

  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    await address.update({ isActive: false });
  }
}
