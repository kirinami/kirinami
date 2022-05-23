import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/api/auth/decorators/current-user.decorator';
import { JwtAccess } from '@/api/auth/decorators/jwt-access.decorator';
import { User } from '@/api/users/user.entity';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';
import { Todo } from './todo.entity';

@ApiTags('todos')
@JwtAccess()
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {
  }

  @ApiOkResponse({
    description: 'Ok',
    type: Todo,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string' },
      },
    },
  })
  @ApiQuery({
    name: 'relations',
    type: 'string',
    isArray: true,
    style: 'form',
    explode: false,
    required: false,
    allowEmptyValue: false,
  })
  @Get()
  async retrieveAll(@CurrentUser() user: User, @Query('relations') relations?: string) {
    return this.todosService.findAllByUserId(user.id, relations?.split(',').map((r) => r.trim()).filter(Boolean));
  }

  @ApiOkResponse({
    description: 'Ok',
    type: Todo,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string' },
      },
    },
  })
  @ApiQuery({
    name: 'relations',
    type: 'string',
    isArray: true,
    style: 'form',
    explode: false,
    required: false,
    allowEmptyValue: false,
  })
  @Get(':id')
  async retrieveById(@CurrentUser() user: User, @Param('id') id: number, @Query('relations') relations?: string) {
    const todo = await this.todosService.findOneByIdAndUserId(id, user.id, relations?.split(',').map((r) => r.trim()).filter(Boolean));
    if (!todo) throw new NotFoundException();

    return todo;
  }

  @ApiOkResponse({
    description: 'Ok',
    type: Todo,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string' },
      },
    },
  })
  @ApiQuery({
    name: 'relations',
    type: 'string',
    isArray: true,
    style: 'form',
    explode: false,
    required: false,
    allowEmptyValue: false,
  })
  @Post()
  async create(@CurrentUser() user: User, @Body() createTodoDto: CreateTodoDto, @Query('relations') relations?: string) {
    const { id } = await this.todosService.createByUserId(user.id, createTodoDto);

    const todo = await this.todosService.findOneByIdAndUserId(id, user.id, relations?.split(',').map((r) => r.trim()).filter(Boolean));
    if (!todo) throw new NotFoundException();

    return todo;
  }

  @ApiOkResponse({
    description: 'Ok',
    type: Todo,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string' },
      },
    },
  })
  @ApiQuery({
    name: 'relations',
    type: 'string',
    isArray: true,
    style: 'form',
    explode: false,
    required: false,
    allowEmptyValue: false,
  })
  @Patch(':id')
  async update(@CurrentUser() user: User, @Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto, @Query('relations') relations?: string) {
    const { affected } = await this.todosService.updateByIdAndUserId(id, user.id, updateTodoDto);
    if (affected === 0) throw new NotFoundException();

    const todo = await this.todosService.findOneByIdAndUserId(id, user.id, relations?.split(',').map((r) => r.trim()).filter(Boolean));
    if (!todo) throw new NotFoundException();

    return todo;
  }

  @ApiOkResponse({
    description: 'Ok',
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string' },
      },
    },
  })
  @Delete(':id')
  async delete(@CurrentUser() user: User, @Param('id') id: number) {
    const todo = await this.todosService.findOneByIdAndUserId(id, user.id);
    if (!todo) throw new NotFoundException();

    const { affected } = await this.todosService.deleteByIdAndUserId(id, user.id);
    if (affected === 0) throw new NotFoundException();

    return todo;
  }
}
