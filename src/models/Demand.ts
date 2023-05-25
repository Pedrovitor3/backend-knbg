import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid'; 
import { Profile } from "./Profile";
import { Stage } from "./Stage";
import { UsersDemand } from "./UsersDemand";
import { Phase } from "./Phase";


@Entity("demand")
export class Demand {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;


    @Column()
    prioridade: number;

    

    @Column({nullable: true})
    concluded_at:Date;

    @Column({ type: 'varchar' })
    description: string;



    @ManyToMany((type) => Profile, (profile) => profile.demands, {
      eager: true
    })
    @JoinTable()
    profiles: Profile[];


    @OneToMany((type)=> Stage,(stage) => stage.demand, {
      eager: true
    })
    stages: Stage[];


    @OneToMany((type)=> UsersDemand,(usersDemand) => usersDemand.demand, {
      eager: true
    })
    usersDemands: UsersDemand[];

    @ManyToOne((type) => Phase, (phase) => phase.demands)
    phase: Phase;

    


    //sso
    // id_usuario_demandante
    // id_setor

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