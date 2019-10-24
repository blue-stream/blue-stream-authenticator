export interface IUser {
	id: string;
	name?: Name;
	firstName: string;
	lastName: string;
	fullName?: string;
	mail: string;
	hierarchy?: string[];
	hierarchyFlat?: string;
}

interface Name {
	firstName: string;
	lastName: string;
}
