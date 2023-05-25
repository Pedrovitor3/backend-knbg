import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid'; 
import { Demand } from "./Demand";
import { UsersDemand } from "./UsersDemand";

@Entity("profile") 
export class Profile {

  @PrimaryColumn()
  readonly id: string; 
  
  @Column() 
  name: string;

  @ManyToMany(() => Demand, (demand) => demand.profiles)
  demands: Demand[];

  @OneToMany(() => UsersDemand, (userDemand) => userDemand.profile)
  usersDemands: UsersDemand;


 //sso
 //id_setor: string;

  @DeleteDateColumn()
  deleted_at: Date;

  @CreateDateColumn() 
  created_at: Date;

  @UpdateDateColumn() 
  update_at: Date;


  /*
      A geração do uuID automático não será por meio do SGBD, e sim aqui pelo código
      Utilizando a bilioteca: yarn add uuid
      Tipos da biblioteca uuid: yarn add @types/uuid -D
  */
  constructor() {
    // Se esse ID não existir, gerar um id
    if (!this.id) {
      this.id = uuid();
    }
  }
}
