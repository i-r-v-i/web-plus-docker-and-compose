import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  createWish(@Body() createWishDto: CreateWishDto, @Request() req) {
    return this.wishesService.createWish(createWishDto, req.user.id);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Request() req,
  ) {
    return this.wishesService.updateWish(id, updateWishDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeWish(@Param('id') id: number, @Request() req) {
    return this.wishesService.removeWish(id, req.user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  copyWithById(@Param('id') id: number, @Request() req) {
    return this.wishesService.copyWish(id, req.user);
  }
}
