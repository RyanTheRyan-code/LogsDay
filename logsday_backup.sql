--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid,
    profile_id uuid,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_edited boolean DEFAULT false
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: followers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.followers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    follower_id uuid,
    following_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.followers OWNER TO postgres;

--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE public.knex_migrations OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.knex_migrations_id_seq OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


ALTER TABLE public.knex_migrations_lock OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid,
    type character varying(255) NOT NULL,
    url character varying(255) NOT NULL,
    filename character varying(255),
    size_bytes integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    mimetype character varying(255)
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid,
    title character varying(255) NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    streak_day integer,
    chapter character varying(255),
    location point,
    is_published boolean DEFAULT true,
    project_id uuid NOT NULL,
    post_index integer
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    email character varying(255) NOT NULL,
    password_hash character varying(255),
    bio text,
    profile_picture_url character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp with time zone,
    is_google_user boolean DEFAULT false,
    google_id character varying(255)
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: social_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid,
    platform character varying(255) NOT NULL,
    url character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.social_links OWNER TO postgres;

--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, post_id, profile_id, content, created_at, is_edited) FROM stdin;
\.


--
-- Data for Name: followers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.followers (id, follower_id, following_id, created_at) FROM stdin;
\.


--
-- Data for Name: knex_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knex_migrations (id, name, batch, migration_time) FROM stdin;
1	20241124052230_initial_schema.js	1	2024-11-23 21:33:13.862-08
3	20241124_create_projects.js	2	2024-11-23 23:45:33.464-08
4	20241124_create_default_project.js	3	2024-11-23 23:52:23.224-08
5	20241124_make_project_required.js	3	2024-11-23 23:52:23.227-08
\.


--
-- Data for Name: knex_migrations_lock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knex_migrations_lock (index, is_locked) FROM stdin;
1	0
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id, post_id, type, url, filename, size_bytes, created_at, mimetype) FROM stdin;
1f8efb7d-c2cf-40c9-b88a-524a58ffb91b	0a24fd41-5575-4f2c-8bfe-3fd1545a6a46	image	/uploads/1732429377116.jpg	1732429377116.jpg	4510350	2024-11-23 22:22:57.156152-08	\N
1915e5f5-9038-495f-bec4-626e71adfc1e	56547766-9f80-4ad8-be0a-1dbf6def6547	image	/uploads/1732429385420.jpg	1732429385420.jpg	4510350	2024-11-23 22:23:05.437984-08	\N
10d301f0-3834-4cb7-981d-365cbcf1070d	72eaa3ce-19e8-4652-8e65-feb9f9df3b59	image	/uploads/1732429514181.jpg	1732429514181.jpg	3520562	2024-11-23 22:25:14.214109-08	\N
0bf02bdb-1bb8-48a5-8023-2646270d6f2b	f1b9006b-eaeb-4f75-b329-fe5b1dcfcf40	image	/uploads/1732429674484.png	1732429674484.png	769485	2024-11-23 22:27:54.495622-08	\N
6f206418-ba3f-46aa-81b9-3c926a7aa699	7158fb75-aafe-43e5-8cf9-5fe782520819	image	/uploads/1732429945454.jpg	1732429945454.jpg	4435094	2024-11-23 22:32:25.505127-08	\N
712fce28-edbf-49b5-a79c-2ea238e3d8c7	7158fb75-aafe-43e5-8cf9-5fe782520819	image	/uploads/1732429945467.jpg	1732429945467.jpg	2369838	2024-11-23 22:32:25.505127-08	\N
7af73029-2acd-4a15-8b68-054ceaf73fc7	7158fb75-aafe-43e5-8cf9-5fe782520819	image	/uploads/1732429945473.jpg	1732429945473.jpg	4735452	2024-11-23 22:32:25.505127-08	\N
f769c9f8-1c6f-4912-b377-db0338404c37	7158fb75-aafe-43e5-8cf9-5fe782520819	image	/uploads/1732429945484.png	1732429945484.png	4121338	2024-11-23 22:32:25.505127-08	\N
6a48f11d-0f2a-41a2-bdae-c4b817cb2942	7158fb75-aafe-43e5-8cf9-5fe782520819	image	/uploads/1732429945498.jpg	1732429945498.jpg	481538	2024-11-23 22:32:25.505127-08	\N
d85f09b5-e187-440a-8a9b-aec6699cf61c	f91530de-5cf6-40f6-a19d-b6b8f4a0f1f5	video	/uploads/1732430876308-771951581-PXL_20241110_035832237.LS.mp4	1732430876308-771951581-PXL_20241110_035832237.LS.mp4	9832678	2024-11-23 22:47:56.342569-08	video/mp4
8e81961a-65c2-49f4-bcb0-3058c232895d	4bd77822-c49b-4328-80e5-0803ce2ca1a1	image	/uploads/1732522925350-67143869-PXL_20241104_031259810.MP.jpg	PXL_20241104_031259810.MP.jpg	\N	2024-11-25 00:22:05.381674-08	\N
4422843d-0a1e-432c-aa98-9dfdfd65b309	2e869d75-eb71-4563-8565-36f3681916b1	image	/uploads/1732573743706-257554853-1732429674484.png	1732429674484.png	\N	2024-11-25 14:29:03.728922-08	\N
4932f741-75d8-4b86-a97a-a63c78f5c2e0	ff447ff7-fc6f-4bc2-aa92-c4d94ac4f82b	image	/uploads/1732674648906-113159665-1732429945484.png	1732429945484.png	\N	2024-11-26 18:30:49.009004-08	\N
2b1ffee6-cda9-44ec-8a5c-ce9b9679b1d4	ff447ff7-fc6f-4bc2-aa92-c4d94ac4f82b	video	/uploads/1732674648935-806308281-PXL_20241110_035832237.LS.mp4	PXL_20241110_035832237.LS.mp4	\N	2024-11-26 18:30:49.009004-08	\N
d0d34a7f-b109-4b59-9f3e-09bedb1daea9	c63ae370-9bad-44cb-a3ba-aba94cba83be	video	/uploads/1732774612432-469788581-PXL_20241110_035832237.LS.mp4	PXL_20241110_035832237.LS.mp4	\N	2024-11-27 22:16:52.489082-08	\N
7898d282-d6df-4b0b-9310-a36baac399cf	abf8f25d-2099-45d4-8e3d-22194a96ac6c	image	/uploads/1733869843166-185519919-bark-texture.jpg	bark-texture.jpg	\N	2024-12-10 14:30:43.310678-08	\N
a7cbe6c1-85c9-481c-a66e-99122f98b943	abf8f25d-2099-45d4-8e3d-22194a96ac6c	image	/uploads/1733869843230-190594979-wood-grain.jpg	wood-grain.jpg	\N	2024-12-10 14:30:43.310678-08	\N
0d2316f5-a59b-4013-82da-0c2df7b72eab	abf8f25d-2099-45d4-8e3d-22194a96ac6c	image	/uploads/1733869843287-802558520-wood-background.jpg	wood-background.jpg	\N	2024-12-10 14:30:43.310678-08	\N
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, profile_id, title, content, created_at, streak_day, chapter, location, is_published, project_id, post_index) FROM stdin;
ce418cdf-6378-465f-b77e-a7c959393cb4	9cb3c4a2-9ead-4e56-9eff-665524bb1525	PostgreSQL Test Post	Testing our new PostgreSQL database!	2024-11-23 21:46:06.161033-08	1	\N	\N	t	68b63f9a-cb19-4f5d-8cf5-49bb6c928f7c	1
57e9d12c-aae2-461f-b714-025c1083b683	b5dd190d-3aad-426e-9903-0a6848e7681b	picture	pic	2024-11-23 22:20:45.678591-08	1	\N	\N	t	992b9b22-1116-419f-bbee-2eb07bcacf7a	1
93eba069-14b6-4b13-ae2b-3a74f43aaae7	b5dd190d-3aad-426e-9903-0a6848e7681b	picture	pic	2024-11-23 22:20:50.053127-08	3	\N	\N	t	992b9b22-1116-419f-bbee-2eb07bcacf7a	1
0a24fd41-5575-4f2c-8bfe-3fd1545a6a46	b5dd190d-3aad-426e-9903-0a6848e7681b	pic	pic	2024-11-23 22:22:57.154223-08	1	\N	\N	t	992b9b22-1116-419f-bbee-2eb07bcacf7a	1
56547766-9f80-4ad8-be0a-1dbf6def6547	b5dd190d-3aad-426e-9903-0a6848e7681b	pic	pic	2024-11-23 22:23:05.436061-08	5	\N	\N	t	992b9b22-1116-419f-bbee-2eb07bcacf7a	1
72eaa3ce-19e8-4652-8e65-feb9f9df3b59	b5dd190d-3aad-426e-9903-0a6848e7681b	lets how this pic is going noe	# woo	2024-11-23 22:25:14.211179-08	1	\N	\N	t	992b9b22-1116-419f-bbee-2eb07bcacf7a	1
f1b9006b-eaeb-4f75-b329-fe5b1dcfcf40	b5dd190d-3aad-426e-9903-0a6848e7681b	ok but pics are working now?`	## maybe?\r\n\r\n@ a\r\n\r\n~pen~	2024-11-23 22:27:54.493485-08	1	\N	\N	t	992b9b22-1116-419f-bbee-2eb07bcacf7a	1
7158fb75-aafe-43e5-8cf9-5fe782520819	b5dd190d-3aad-426e-9903-0a6848e7681b	new post alert	# bing	2024-11-23 22:32:25.503716-08	1	\N	\N	t	992b9b22-1116-419f-bbee-2eb07bcacf7a	1
cc91371e-e150-4163-b714-9ca9ce79e9b7	b5dd190d-3aad-426e-9903-0a6848e7681b	vid test	video?	2024-11-23 22:41:18.470086-08	1	\N	\N	t	992b9b22-1116-419f-bbee-2eb07bcacf7a	1
f91530de-5cf6-40f6-a19d-b6b8f4a0f1f5	b5dd190d-3aad-426e-9903-0a6848e7681b	videdo	# vid test	2024-11-23 22:47:56.338375-08	1	\N	\N	t	992b9b22-1116-419f-bbee-2eb07bcacf7a	1
9b2da5c0-2abe-4bd3-80cf-c58fa71b540b	bccdde11-e530-4c98-b79c-35256efb5969	PostgreSQL Test Post	Testing our new PostgreSQL database!	2024-11-23 21:48:15.711098-08	1	\N	\N	t	76ca4aa9-3f8e-4a9e-bdb4-74e35a92ff17	1
a06c86b8-42c9-4cf4-9ec0-427c0f71cfbf	bccdde11-e530-4c98-b79c-35256efb5969	PostgreSQL Test Post	Testing our new PostgreSQL database!	2024-11-23 21:49:19.546246-08	1	\N	\N	t	76ca4aa9-3f8e-4a9e-bdb4-74e35a92ff17	1
4bd77822-c49b-4328-80e5-0803ce2ca1a1	b5dd190d-3aad-426e-9903-0a6848e7681b	clock	clock	2024-11-25 00:22:05.37688-08	1	\N	\N	t	07fef21b-d268-40fc-9dc1-b2497c3881b5	1
be426ebf-fe2a-4658-88c4-5d0cbd4c028b	d8742032-ca50-4dc9-a9f6-723ce3d7bf3e	log!	woah!	2024-11-25 13:54:20.618441-08	1	\N	\N	t	071f6ae2-0ad4-4fda-83a7-78853a627154	1
963ddad2-8242-4e2e-bd1e-40cd72f8bd9e	d8742032-ca50-4dc9-a9f6-723ce3d7bf3e	aw man	drats	2024-11-25 13:54:39.917742-08	1	\N	\N	t	071f6ae2-0ad4-4fda-83a7-78853a627154	2
007b023c-057e-4c6c-a3b6-eeedeff03e1d	450335ca-a104-4810-9579-1a4602666126	titel!	wowee	2024-11-25 14:04:33.536039-08	1	\N	\N	t	82a5e2ba-0bab-4708-9de3-b8c211db3784	1
2e869d75-eb71-4563-8565-36f3681916b1	b5dd190d-3aad-426e-9903-0a6848e7681b	title	pow	2024-11-25 14:29:03.722241-08	1	\N	\N	t	07fef21b-d268-40fc-9dc1-b2497c3881b5	2
ff447ff7-fc6f-4bc2-aa92-c4d94ac4f82b	b5dd190d-3aad-426e-9903-0a6848e7681b	titel	## content	2024-11-26 18:30:48.99449-08	1	\N	\N	t	07fef21b-d268-40fc-9dc1-b2497c3881b5	3
23f3102c-15f7-4f4c-8413-bbd214e655b0	450335ca-a104-4810-9579-1a4602666126	post?	ok?	2024-11-27 17:11:33.040991-08	1	\N	\N	t	82a5e2ba-0bab-4708-9de3-b8c211db3784	2
c63ae370-9bad-44cb-a3ba-aba94cba83be	450335ca-a104-4810-9579-1a4602666126	TItel	wow	2024-11-27 22:16:52.477989-08	1	\N	\N	t	82a5e2ba-0bab-4708-9de3-b8c211db3784	3
abf8f25d-2099-45d4-8e3d-22194a96ac6c	b5dd190d-3aad-426e-9903-0a6848e7681b	New NovaLink features!	# Project Update: December 10, 2024\r\n\r\n## Overview\r\n\r\nThis update outlines the latest progress, resolved issues, and upcoming priorities for the project, focusing on improving functionality, addressing challenges, and planning the next phase of development.\r\n\r\n## Recent Progress\r\n\r\n- **New Feature Rollout**: Introduced a user feedback system allowing real-time comments and ratings.\r\n- **Performance Enhancements**: Optimized database queries to reduce loading times by up to 40%.\r\n- **UI/UX Updates**: Improved navigation flow based on user testing, resulting in a more intuitive interface.\r\n\r\n## Challenges\r\n\r\n- **Integration Delays**: Encountered delays while implementing third-party APIs due to unexpected compatibility issues.\r\n- **Load Testing**: Identified bottlenecks during high-traffic simulations that require further optimization.\r\n\r\n## Next Steps\r\n\r\n- **Bug Fixes**: Address identified API integration issues and ensure smooth third-party service communication.\r\n- **New Features in Development**: Begin work on advanced search functionality to improve content discoverability.\r\n- **Scalability Planning**: Finalize strategies to handle increasing user demand and ensure system reliability.\r\n\r\nThank you for following the progress of our project! WeΓÇÖre excited to continue enhancing the platform and delivering value to users. Stay tuned for more updates!\r\n	2024-12-10 14:30:43.305371-08	\N	\N	\N	t	992b9b22-1116-419f-bbee-2eb07bcacf7a	10
1f422ee2-9d20-4761-ac44-77e940308f21	b5dd190d-3aad-426e-9903-0a6848e7681b	titEL	# title	2024-12-10 15:02:46.576353-08	\N	\N	\N	t	992b9b22-1116-419f-bbee-2eb07bcacf7a	11
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, name, email, password_hash, bio, profile_picture_url, created_at, last_login, is_google_user, google_id) FROM stdin;
237d3a2e-9581-4276-a70a-1e1eaffe3ee2	r	r@y.com	$2b$10$AF.OoUOqHiNvZh2oiR65EuZWvSn4fp48WCexUqI5C7ag1kSoHvKbG	\N	\N	2024-11-23 21:38:38.351-08	\N	f	\N
8208d6b4-c7a5-47b6-8b5e-1a683d522b07	r	r@y.bh	$2b$10$IhnTswznDHKyWuAKGvngCe8iydduC4dl27wVMmvzw.NzR.6pDP1by	\N	\N	2024-11-23 21:38:38.476-08	\N	f	\N
b5dd190d-3aad-426e-9903-0a6848e7681b	ryan.makela2004	ryan.makela2004@gmail.com	\N	\N	\N	2024-11-23 21:38:38.479-08	\N	f	\N
9cb3c4a2-9ead-4e56-9eff-665524bb1525	Test User 2	test2@example.com	$2b$10$4J8zpVf2mDDblvCm/ZYq0OXQHLJoTjv1q1XwRYJ77tA/nohZFgmxa	\N	\N	2024-11-23 21:45:48.800915-08	\N	f	\N
bccdde11-e530-4c98-b79c-35256efb5969	Test User 3	test3@example.com	$2b$10$LTT8111POq5Lg9BVrLw5hOmtTHKI2Rv3N4x1zTSefSMvhvih./y6C	\N	\N	2024-11-23 21:48:01.614601-08	\N	f	\N
d8742032-ca50-4dc9-a9f6-723ce3d7bf3e	\N	r.a@gmail.com	$2b$10$hIUWbAWfMpfRfsoibIiH5ObX.yC0Au2BB0f7ehbAdHV/ivMELAF7a	\N	\N	2024-11-25 13:53:47.804552-08	\N	f	\N
450335ca-a104-4810-9579-1a4602666126	Flyin Ryan	r.m@gmail.com	$2b$10$YfhI1HtgDIPfNHHF8gFF0.vubEAxpoallxF/1qiYQAulL./lRtZx2	\N	\N	2024-11-25 14:04:01.744204-08	2024-12-11 10:29:04.678056-08	f	\N
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, profile_id, name, description, created_at, updated_at) FROM stdin;
07fef21b-d268-40fc-9dc1-b2497c3881b5	b5dd190d-3aad-426e-9903-0a6848e7681b	proj test	test	2024-11-23 23:47:38.175985-08	2024-11-23 23:47:38.175985-08
68b63f9a-cb19-4f5d-8cf5-49bb6c928f7c	9cb3c4a2-9ead-4e56-9eff-665524bb1525	General	Default project for existing posts	2024-11-23 23:52:23.202765-08	2024-11-23 23:52:23.202765-08
992b9b22-1116-419f-bbee-2eb07bcacf7a	b5dd190d-3aad-426e-9903-0a6848e7681b	General	Default project for existing posts	2024-11-23 23:52:23.202765-08	2024-11-23 23:52:23.202765-08
76ca4aa9-3f8e-4a9e-bdb4-74e35a92ff17	bccdde11-e530-4c98-b79c-35256efb5969	General	Default project for existing posts	2024-11-23 23:52:23.202765-08	2024-11-23 23:52:23.202765-08
071f6ae2-0ad4-4fda-83a7-78853a627154	d8742032-ca50-4dc9-a9f6-723ce3d7bf3e	r.a proj	woah	2024-11-25 13:54:10.693255-08	2024-11-25 13:54:10.693255-08
82a5e2ba-0bab-4708-9de3-b8c211db3784	450335ca-a104-4810-9579-1a4602666126	Flyiin Project	new project	2024-11-25 14:04:22.230978-08	2024-11-25 14:04:22.230978-08
\.


--
-- Data for Name: social_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_links (id, profile_id, platform, url, created_at) FROM stdin;
\.


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knex_migrations_id_seq', 5, true);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knex_migrations_lock_index_seq', 1, true);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: followers followers_follower_id_following_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_follower_id_following_id_unique UNIQUE (follower_id, following_id);


--
-- Name: followers followers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_unique UNIQUE (email);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: social_links social_links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_pkey PRIMARY KEY (id);


--
-- Name: comments comments_post_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_foreign FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: comments comments_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_profile_id_foreign FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: followers followers_follower_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_follower_id_foreign FOREIGN KEY (follower_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: followers followers_following_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_following_id_foreign FOREIGN KEY (following_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: media media_post_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_post_id_foreign FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: posts posts_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_profile_id_foreign FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: posts posts_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: projects projects_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_profile_id_foreign FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: social_links social_links_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_profile_id_foreign FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

