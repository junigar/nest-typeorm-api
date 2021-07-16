import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, TreeRepository } from 'typeorm';
import { TaskDto } from './task.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly repository: TreeRepository<Task>,
      ) {}
    
      async getAll() {
        return this.repository.find({relations: ['tareaDeRequisito', 'subTareas']});
      }

      async getTaskTreeView() {
        let response = this.repository.findTrees();
        return response;
      }
    
      async getById(id: number) {
        const post = await this.repository.findOne(id, {relations: ['tareaDeRequisito', 'subTareas']});
        if (!post) throw new NotFoundException('Task does not exist');
        return post;
      }
    
      async createOne(dto: TaskDto) {
        let tareaDeRequisito: Task;
        const task = this.repository.create(dto);
        if(dto.tareaDeRequisitoId){
          tareaDeRequisito = await this.repository.findOne(dto.tareaDeRequisitoId);
          task.tareaDeRequisito = tareaDeRequisito;
        }
        return await this.repository.save(task);
      }
    
      async editOne(id: number, dto: TaskDto) {
        let tareaDeRequisito: Task;
        const task = await this.repository.findOne(id);
        if (!task) throw new NotFoundException('Task does not exist');
        
        if(dto.tareaDeRequisitoId){
          tareaDeRequisito = await this.repository.findOne(dto.tareaDeRequisitoId);
          task.tareaDeRequisito = tareaDeRequisito;
        }else{
          task.tareaDeRequisito = null;
        }
    
        const editedTask = Object.assign(task, dto);
        return await this.repository.save(editedTask);
      }
    
      async deleteOne(id: number) {
        return await this.repository.delete(id);
      }

}
