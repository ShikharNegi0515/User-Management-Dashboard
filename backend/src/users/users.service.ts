import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import {
  JsonPlaceholderUser,
  PaginatedUsersResponse,
  User,
} from './interfaces/user.interface';

const JSON_PLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com/users';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);
  private users: User[] = [];
  private nextId = 1000;

  constructor(private readonly httpService: HttpService) {}

  async onModuleInit() {
    await this.loadUsersFromApi();
  }

  private mapFromPlaceholder(user: JsonPlaceholderUser): User {
    const nameParts = user.name.trim().split(/\s+/);
    const firstName = nameParts[0] ?? '';
    const lastName = nameParts.slice(1).join(' ') || firstName;

    return {
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      department: user.company?.name ?? 'Unknown',
    };
  }

  private async loadUsersFromApi(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<JsonPlaceholderUser[]>(JSON_PLACEHOLDER_URL),
      );
      this.users = response.data.map((user) => this.mapFromPlaceholder(user));
      this.nextId = Math.max(...this.users.map((u) => u.id), 0) + 1;
      this.logger.log(`Loaded ${this.users.length} users from JSONPlaceholder`);
    } catch (error) {
      this.logger.error('Failed to load users from JSONPlaceholder', error);
      throw new HttpException(
        'Unable to fetch users from external API',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  findAll(query: QueryUsersDto): PaginatedUsersResponse {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'id',
      sortOrder = 'asc',
      firstName,
      lastName,
      email,
      department,
    } = query;

    let filtered = [...this.users];

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.department.toLowerCase().includes(term) ||
          String(user.id).includes(term),
      );
    }

    if (firstName) {
      filtered = filtered.filter((user) =>
        user.firstName.toLowerCase().includes(firstName.toLowerCase()),
      );
    }
    if (lastName) {
      filtered = filtered.filter((user) =>
        user.lastName.toLowerCase().includes(lastName.toLowerCase()),
      );
    }
    if (email) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(email.toLowerCase()),
      );
    }
    if (department) {
      filtered = filtered.filter((user) =>
        user.department.toLowerCase().includes(department.toLowerCase()),
      );
    }

    const sortKey = sortBy as keyof User;
    filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortOrder === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total, page, limit, totalPages };
  }

  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      await firstValueFrom(
        this.httpService.post(JSON_PLACEHOLDER_URL, createUserDto),
      );
    } catch (error) {
      this.logger.error('JSONPlaceholder POST failed', error);
      throw new HttpException(
        'Unable to create user via external API',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const newUser: User = { id: this.nextId++, ...createUserDto };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    try {
      await firstValueFrom(
        this.httpService.put(`${JSON_PLACEHOLDER_URL}/${id}`, updateUserDto),
      );
    } catch (error) {
      this.logger.error('JSONPlaceholder PUT failed', error);
      throw new HttpException(
        'Unable to update user via external API',
        HttpStatus.BAD_GATEWAY,
      );
    }

    this.users[index] = { ...this.users[index], ...updateUserDto };
    return this.users[index];
  }

  async remove(id: number): Promise<void> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    try {
      await firstValueFrom(
        this.httpService.delete(`${JSON_PLACEHOLDER_URL}/${id}`),
      );
    } catch (error) {
      this.logger.error('JSONPlaceholder DELETE failed', error);
      throw new HttpException(
        'Unable to delete user via external API',
        HttpStatus.BAD_GATEWAY,
      );
    }

    this.users.splice(index, 1);
  }
}
