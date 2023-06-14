import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany,  OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid'; 
import { Profile } from "./Profile";
import { Stage } from "./Stage";
import { UsersDemand } from "./UsersDemand";

enum Status {
  aguardando = 'aguardando',
  executando = 'executando',
  concluido = 'concluido',
  pendente = 'pendente',
  recusado = 'recusado',
}


@Entity("demand")
export class Demand {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;

    @Column({nullable: true})
    concluded_at:Date;

    @Column({ type: 'varchar' })
    description: string;

    @Column({type: 'enum', enum: Status, default: Status.recusado })
    status: Status;


    @ManyToMany((type) => Profile, (profile) => profile.demands)
    profiles: Profile[];


    @OneToMany((type)=> Stage,(stage) => stage.demand)
    stages: Stage[];


    @OneToMany((type)=> UsersDemand,(usersDemand) => usersDemand.demand, {
      eager: true
    })
    usersDemands: UsersDemand[];
    

    @DeleteDateColumn()
    deleted_at: Date;

    @CreateDateColumn() // Para já capturar a data e fazer a formatação
    created_at: Date;

    @UpdateDateColumn() // Para já capturar a data e fazer a formatação
    update_at: Date;



    constructor() {
        // Se esse ID não existir, gerar um id
        if (!this.id) {
          this.id = uuid();
        }
      }
}