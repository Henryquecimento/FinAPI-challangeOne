import { createConnection, getConnectionOptions } from "typeorm";

export default async (host = "database") => {
  const options = await getConnectionOptions();

  Object.assign(options, {
    host,
    database: process.env.NODE_ENV === "test" ? "fin_api" : options.database,
  });

  return createConnection(options);
};
