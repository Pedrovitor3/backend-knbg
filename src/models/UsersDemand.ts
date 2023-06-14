import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid'; 
import { Demand } from "./Demand";
import { Profile } from "./Profile";

@Entity("user_demand") 
export class UsersDemand {

  @PrimaryColumn()
  readonly id: string; 

  @ManyToOne(() => Demand,(demand) => demand.usersDemands)
  demand: Demand;

  @ManyToOne(() => Profile, (profile) =>profile.usersDemands)
  profile: Profile;
  

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
