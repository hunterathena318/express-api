export interface User {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  hash?: string;
  updatedAt: Date,
}

export interface RefreshToken {
  id?: number;
	userId: number;
	refreshToken: string;
	expiresIn: Date;
	updatedAt?: Date;
	createdAt?: Date;

}
