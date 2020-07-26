# sdg-ta code challenge
> To get this project up and running according to these instructions, make sure you have:
- node / npm
- yarn
- postgres
- sendgrid api key
> Tweak as needed
Access api docs at: ::fq-host/api-docs
#### -- Quick Start
Get code
```sh
$ git clone https://github.com/flink-sdg/sdg-ta-challenge.git
```
Navigate into the directory
```sh
$ cd sdg-ta-challenge
```
Install
```sh
$ yarn install
```
Edit .env file
- The file at sdg-ta-challenge > .env.sample should be edited as desired
```sh
PORT=8000
PGUSER=postgres
PGHOST=<postgres host>
PGPASSWORD=<postgres password>
PGDATABASE=<postgres database>
PGPORT=<postgres port>
LOGREQUESTS=false
LOGLEVEL=debug
```
Setup database
```sh
$ yarn databaseInit
```
Run your tests
```sh
$ yarn test
```
Start your server
```sh
$ yarn dev
```
#### To manually create your database if uncomfortable with databaseInit
```
CREATE FUNCTION public.dates_on_insert()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$BEGIN
	NEW.create_date := EXTRACT(epoch from now());
	NEW.update_date := EXTRACT(epoch from now());
	RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.dates_on_insert()
    OWNER TO postgres;

-- FUNCTION: public.dates_on_update()

-- DROP FUNCTION public.dates_on_update();

CREATE FUNCTION public.dates_on_update()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$BEGIN
	NEW.update_date := EXTRACT(epoch from now());
	RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.dates_on_update()
    OWNER TO postgres;

-- Table: public.redditors

-- DROP TABLE public.redditors;

CREATE TABLE public.redditors
(
    email_address character varying(30) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(40) COLLATE pg_catalog."default",
    id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(30) COLLATE pg_catalog."default",
    time_zone_identifier character varying(30) COLLATE pg_catalog."default",
    create_date double precision NOT NULL,
    update_date double precision NOT NULL,
    delete_date double precision,
    email_enabled boolean,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.redditors
    OWNER to postgres;

-- Trigger: dates_on_insert

-- DROP TRIGGER dates_on_insert ON public.redditors;

CREATE TRIGGER dates_on_insert
    BEFORE INSERT
    ON public.redditors
    FOR EACH ROW
    EXECUTE PROCEDURE public.dates_on_insert();

-- Trigger: dates_on_update

-- DROP TRIGGER dates_on_update ON public.redditors;

CREATE TRIGGER dates_on_update
    BEFORE UPDATE 
    ON public.redditors
    FOR EACH ROW
    EXECUTE PROCEDURE public.dates_on_update();

-- Table: public.subreddits

-- DROP TABLE public.subreddits;

CREATE TABLE public.subreddits
(
    id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    subreddit character varying(50) COLLATE pg_catalog."default" NOT NULL,
    name character varying(50) COLLATE pg_catalog."default",
    description character varying(100) COLLATE pg_catalog."default",
    create_date double precision NOT NULL,
    update_date double precision NOT NULL,
    delete_date double precision,
    redditor_id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    favorite boolean,
    CONSTRAINT subreddits_pkey PRIMARY KEY (id),
    CONSTRAINT redditor_id_fkey FOREIGN KEY (redditor_id)
        REFERENCES public.redditors (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.subreddits
    OWNER to postgres;

-- Trigger: dates_on_insert

-- DROP TRIGGER dates_on_insert ON public.subreddits;

CREATE TRIGGER dates_on_insert
    BEFORE INSERT
    ON public.subreddits
    FOR EACH ROW
    EXECUTE PROCEDURE public.dates_on_insert();

-- Trigger: dates_on_update

-- DROP TRIGGER dates_on_update ON public.subreddits;

CREATE TRIGGER dates_on_update
    BEFORE UPDATE 
    ON public.subreddits
    FOR EACH ROW
    EXECUTE PROCEDURE public.dates_on_update();
```
