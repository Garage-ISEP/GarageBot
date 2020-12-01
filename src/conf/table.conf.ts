import { TableOptions } from "sequelize-typescript";

const tableConf: TableOptions = {
	updatedAt: false,
	createdAt: false,
	timestamps: false,
}

export { tableConf };