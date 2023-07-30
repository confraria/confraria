containerName=gotosocial

GTS_PORT=1234
GTS_HOST=fediverse.confraria.me
GTS_ACCOUNT_DOMAIN=confraria.me
GTS_DB_TYPE=sqlite
GTS_DB_ADDRESS=/gotosocial/storage/data.db
GTS_LANDING_PAGE_USER=luis
GTS_ACCOUNTS_REGISTRATION_OPEN=false
GTS_STORAGE_BACKEND=s3
GTS_STORAGE_S3_ENDPOINT=s3.eu-central-003.backblazeb2.com
GTS_STORAGE_S3_ACCESS_KEY=$$SECRET_STORAGE_S3_ACCESS_KEY
GTS_STORAGE_S3_SECRET_KEY=$$SECRET_STORAGE_S3_SECRET_KEY
GTS_STORAGE_S3_BUCKET=confraria-social
GTS_ACCOUNTS_REGISTRATION_OPEN=false
PUBLIC_PORT=1234


image-update:
	systemctl stop gotosocial
	podman pull superseriousbusiness/gotosocial
	podman rm -i gotosocialtemp
	podman create \
		-e GTS_PORT=${GTS_PORT} \
		-e GTS_HOST=${GTS_HOST} \
		-e GTS_ACCOUNT_DOMAIN=${GTS_ACCOUNT_DOMAIN} \
		-e GTS_DB_TYPE=${GTS_DB_TYPE} \
		-e GTS_DB_ADDRESS=${GTS_DB_ADDRESS} \
		-e GTS_LANDING_PAGE_USER=${GTS_LANDING_PAGE_USER} \
		-e GTS_ACCOUNTS_REGISTRATION_OPEN=${GTS_ACCOUNTS_REGISTRATION_OPEN} \
		-e GTS_STORAGE_BACKEND=${GTS_STORAGE_BACKEND} \
		-e GTS_STORAGE_S3_ENDPOINT=${GTS_STORAGE_S3_ENDPOINT} \
		-e GTS_STORAGE_S3_ACCESS_KEY=${GTS_STORAGE_S3_ACCESS_KEY} \
		-e GTS_STORAGE_S3_SECRET_KEY=${GTS_STORAGE_S3_SECRET_KEY} \
		-e GTS_STORAGE_S3_BUCKET=${GTS_STORAGE_S3_BUCKET} \
		-e GTS_ACCOUNTS_REGISTRATION_OPEN=${GTS_ACCOUNTS_REGISTRATION_OPEN} \
		--name=${containerName}temp \
		-p ${GTS_PORT}:${PUBLIC_PORT} \
		-v ${PWD}:/gotosocial/storage \
		superseriousbusiness/gotosocial
	podman start -a ${containerName}temp

commit-update:
	podman rm ${containerName}
	podman rename ${containerName}temp ${containerName}
	systemctl start ${containerName}



db-replicate:
	litestream replicate --config ./litestream.yaml

db-restore:
	litestream restore --config ./litestream.yaml

nginx-config:
	@echo "server {\n\
		listen 80;\n\
		listen [::]:80;\n\
		listen 443 http2 ssl;\n\
		listen [::]:443 http2 ssl;\n\
		server_name $(GTS_ACCOUNT_DOMAIN);\n\
		location / {\n\
			proxy_pass http://localhost:$(PUBLIC_PORT)/;\n\
			proxy_http_version 1.1;\n\
			proxy_set_header Upgrade \$$http_upgrade;\n\
			proxy_set_header Connection 'upgrade';\n\
			proxy_set_header Host \$$host;\n\
			proxy_cache_bypass \$$http_upgrade;\n\
	}\n\
	}\n" | tee /etc/nginx/sites-enabled/gotosocial.conf
	systemctl reload nginx

systemd-config:
	@echo "[Unit] \n\
Description=Gotosocial server \n\
 \n\
[Service] \n\
Restart=always \n\
ExecStart=/usr/bin/podman start -a $(containerName) \n\
ExecStop=/usr/bin/podman stop -t 2 $(containerName) \n\
 \n\
[Install] \n\
WantedBy=local.target \n" | sudo tee /etc/systemd/system/$(containerName).service
	systemctl daemon-reload
	systemctl daemon-reload
	systemctl enable $(containerName)

litestream-config:
	@echo "access-key-id: \$$SECRET_STORAGE_S3_ACCESS_KEY\n\
secret-access-key: \$$SECRET_STORAGE_S3_SECRET_KEY\n\
dbs:\n\
  - path: $$PWD/data.db\n\
    replicas:\n\
      - name: backblaze\n\
        type: s3\n\
        bucket: $(GTS_STORAGE_S3_BUCKET)\n\
        path: db\n\
        endpoint: $(GTS_STORAGE_S3_ENDPOINT)\n\
        force-path-style: true" | tee litestream.yaml

