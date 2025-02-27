import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly model: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newPost = new this.model(createUserDto);
    return await newPost.save();
  }

  async findAll(query) {
    const { limit, page } = query;
    const filters = this.buildFilters(query);
    const skip = (page - 1) * limit;
    const count = await this.model.countDocuments(filters);
    const data = await this.model
      .find(filters, { password: 0, code_access: 0 })
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
    return {
      rows: data,
      pager: {
        total: count,
        pages: Math.ceil(count / limit),
        page: parseInt(page),
        nextPage: parseInt(page) + 1,
        previusPage: parseInt(page) - 1,
      },
    };
    
  }

  async findOne(query) {
    const filters = this.buildFilters(query);
    return await this.model.findOne(filters).lean();
  }

  async findId(id: string) {
    return await this.model.findById(id, {
      password: 0,
    }).lean();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.model.findByIdAndUpdate(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

  buildFilters(query) {
    const {
      name,
      email,
      role,
      status
    } = query || {};
    const filters: any = {};
    if (name) filters.name = { $regex: `^${name}`, $options: 'i' };
    if (email) filters.email = { $regex: `^${email}`, $options: 'i' };
    if (role) filters.role = role;
    if (status) filters.status = status;
    return filters;
  }
}
