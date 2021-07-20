import { NivelPrioridad } from "src/enums/prioridad.enum";
import { Status } from "src/enums/status.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree("closure-table")
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

    @Column({
        nullable: true
    })
    tareaDeRequisitoId: number;
    
    @TreeParent({onDelete: 'CASCADE'})
    tareaDeRequisito: Task;

    @TreeChildren({cascade: true})
    subTareas: Task[];

}