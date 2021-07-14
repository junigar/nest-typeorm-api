import { NivelPrioridad } from "src/enums/prioridad.enum";
import { Status } from "src/enums/status.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    fechaCreacion: Date;

    @Column()
    descripcion: string;

    @Column()
    nivelPrioridad: NivelPrioridad;

    @Column()
    status: Status;
    
    @ManyToOne(()=> Task, task => task.subTareas, {nullable: true, onDelete: 'CASCADE'})
    tareaDeRequisito: Task;

    @OneToMany(()=> Task, task => task.tareaDeRequisito)
    subTareas: Task[];

}