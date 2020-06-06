.PHONY: build


certbot-test:
	@chmod +x ./app/config/ssl/register_ssl.sh
	@sudo ./app/config/ssl/register_ssl.sh \
								--domains "$(DOMAINS)" \
								--email $(EMAIL) \
								--data-path ./app/config/ssl/certbot \
								--staging 1

certbot-prod:
	@chmod +x ./app/config/ssl/register_ssl.sh
	@sudo ./app/config/ssl/register_ssl.sh \
								--domains "$(DOMAINS)" \
								--email $(EMAIL) \
								--data-path ./app/config/ssl/certbot \
								--staging 0

deploy-prod:
	@docker-compose \
					-f docker-compose.yml \
					up -d --build --force-recreate