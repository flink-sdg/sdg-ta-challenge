import dotenv from 'dotenv';
import {DataAccessService} from '../services/data-access.service';

dotenv.config();

const dataAccessService: DataAccessService = DataAccessService.instance();

(async() => {
    try {
        const data: any = await dataAccessService.query(`
CREATE FUNCTION public.dates_on_insert()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$BEGIN
\tNEW.create_date := EXTRACT(epoch from now());
\tNEW.update_date := EXTRACT(epoch from now());
\tRETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.dates_on_insert()
    OWNER TO ${process.env.PGUSER};

-- FUNCTION: public.dates_on_update()

-- DROP FUNCTION public.dates_on_update();

CREATE FUNCTION public.dates_on_update()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$BEGIN
\tNEW.update_date := EXTRACT(epoch from now());
\tRETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.dates_on_update()
    OWNER TO ${process.env.PGUSER};

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
    OWNER TO ${process.env.PGUSER};

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
    OWNER TO ${process.env.PGUSER};

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
`);
        console.log(`Done initializing database.`);
        dataAccessService.end();
    }
    catch(error)
    {
        console.log(`Done initializing database.`);
        dataAccessService.end();
    }
})();
