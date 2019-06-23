export interface IUser {
	id: string;
	name?: Name;
	firstName: string;
	lastName: string;
	mail: string;
}

interface Name {
	firstName: string;
	lastName: string;
}
