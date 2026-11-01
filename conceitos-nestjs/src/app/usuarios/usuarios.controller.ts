import { Body, Controller, Get, Post, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import type { User } from './interfaces/usuarios.interface';

@Controller('usuarios')
export class UsuariosController {
    constructor (protected readonly usuariosService: UsuariosService){}
    @Get()
    listAllUsers(): User[] {
        return this.usuariosService.listAllUsers()
    }

    @Get(':id')
    listUserById(@Param('id', ParseIntPipe) id: number){
        return this.usuariosService.listUser(id)
    }

    @Post()
    createUser(@Body() usuario: User){
        return this.usuariosService.createUser(usuario)
    }

    @Patch(':id')
    updateUserById(@Param('id', ParseIntPipe) id: number, @Body() usuario: User){
        return this.usuariosService.updateUsuarios(id, usuario)
    }

    @Delete(':id')
    deleteUserById(id: number){
        return this.usuariosService.deleteUser(id)
    }
}
