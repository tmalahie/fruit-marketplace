import knex from '../../utils/db/knex';
import process from "process";

async function main() {
    console.log("Delete tables...");
    await knex.migrate.rollback();
    console.log("Create tables...");
    await knex.migrate.latest();
    console.log("Insert data...");
    await knex.seed.run();
    console.log("Done");
}
function clean() {
    process.exit(0);
}
main().then(clean).catch((e) => {
    console.error(e);
    clean();
});