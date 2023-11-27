config-files:
	podman generate systemd --files --name gotosocial
	mv ./*.service /etc/systemd/system/
	cp ./nginx.conf /etc/nginx/sites-enabled/gotosocial.conf
	systemctl reload nginx
	systemctl daemon-reload
	systemctl enable container-gotosocial
	systemctl start container-gotosocial

container:
	podman pull superseriousbusiness/gotosocial:latest
	podman create \
		--env-file=secrets.env \
		--env-file=gotosocial.env \
		-p 1234:1234
		-v ${PWD}/data.db:/gotosocial/storage/data.db \
		--name gotosocial \
		superseriousbusiness/gotosocial

container-run:
	podman run \
		--env-file=secrets.env \
		--env-file=gotosocial.env \
		-p 1234:1234
		-v ${PWD}/data.db:/gotosocial/storage/data.db \
		superseriousbusiness/gotosocial

db-restore:
	podman run \
		--env-file=secrets.env \
		-v ${PWD}:/data \
		-v ${PWD}:/etc/litestream.yml \
		litestream/litestream restore data/data.db

db-replicate:
	podman run \
		--env-file=secrets.env \
		-v ${PWD}:/data \
		-v ${PWD}/litestream.yml:/etc/litestream.yml \
		litestream/litestream replicate
