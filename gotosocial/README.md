# Deployment

This is setup to run in a vm with systemd and podman.

1. Copy files over to remote vm using `scp -r . {user}@{ip}:/opt/gotosocial`
2. On the remove vm create a `secrets.env` based on `secrets.env.example`
3. `make db-restore` will restore the sqllite db using litestream
4. `make container-run`  will run the container for testing
