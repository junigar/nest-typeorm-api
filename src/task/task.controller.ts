import { ConflictException } from '@nestjs/common';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaskDto } from './task.dto';
import { TaskService } from './task.service';

@ApiTags('Task')
@Controller('task')
export class TaskController {

    constructor(private readonly service: TaskService) {}

  @Get()
  async getMany() {
    const data = await this.service.getAll();
    return { data };
  }

  @Get('tree')
  async getTaskTreeView() {
    let response = await this.service.getTaskTreeView();
    let data = [...response];
    data = iterarArreglo(data);

    return data; 
  }
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.getById(id);
    return { data };
  }

  @Post()
  async createPost(@Body() dto: TaskDto) {
    const data = await this.service.createOne(dto);
    return iterarArreglo([data]);
  }

  @Put(':id')
  async editOne(@Param('id') id: number, @Body() dto: TaskDto) {
    if(dto.tareaDeRequisitoId === id)
    throw new ConflictException('Una tarea no se puede depender de si misma.');
    let data = await this.service.editOne(id, dto);
    let aux = iterarArreglo([data])
    return aux[0];
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number) {
    const data = await this.service.deleteOne(id);
    return data;
  }

}

function iterarArreglo(arreglo) {
  const expectedKeys = ['id', 'titulo', 'fechaCreacion', 'descripcion', 'nivelPrioridad', 'status', 'tareaDeRequisitoId'];
  let auxiliar = [...arreglo]
  auxiliar.forEach((item) => {
    if(item['subTareas'] != null)
      iterarArreglo(item['subTareas'])

    for(let key in item){
      if(key == 'subTareas'){
        item['children'] = item['subTareas'];
        delete item['subTareas'];
        continue;
      }
      if(!expectedKeys.includes(key)) delete item[key];
      else{
        item['data'] = {...item['data'], [key]: item[key]}
        delete item[key];
      }
    }
  if(!item["children"]) item["children"]=[];
  })
  return auxiliar;
}
