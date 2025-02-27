import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    lowercase: true,
    index: {
      unique: true,
    },
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Por favor introduzca una dirección de correo electrónico válida',
    ],
  })
  email: string;

  @Prop({
    required: true,
    default: 'client',
  })
  role: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['disabled', 'enabled', 'locked'], default: 'disabled' })
  status: string;
}

const UserModel = SchemaFactory.createForClass(User);
UserModel.pre('save', async function (next) {
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

UserModel.method('validUserInformation', async function (password) {
  const passwordValidate = await bcrypt.compare(password, this.password);
  return passwordValidate;
});

export const UserSchema = UserModel;
