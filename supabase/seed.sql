-- Local dev seed data only. Do NOT run this against your linked cloud
-- project, it inserts fake rows directly into auth.users. Runs
-- automatically on `supabase db reset` locally.
-- Password for every seeded account: "password123"
--
-- IMPORTANT: public.handle_new_user() auto-creates the matching
-- public.customers / public.brands row whenever a row lands in
-- auth.users, reading required fields out of raw_user_meta_data.
-- Do not INSERT INTO public.customers / public.brands directly here,
-- the trigger already does it - this script only supplies the right
-- metadata, then UPDATEs the columns the trigger doesn't set.

-- ============================================================
-- Admin account. handle_new_user() has no admin-specific branch,
-- so this still goes through the normal customer path first (needs
-- a full_name, like any non-brand signup) and picks up a throwaway
-- public.customers row as a side effect. That row - and the welcome
-- notification customers_insert_notify() fires for it - are deleted
-- right after, so the admin account ends up admin-only. This avoids
-- disabling the trigger on auth.users, which requires table
-- ownership seed.sql doesn't have (auth.users is owned by
-- supabase_auth_admin, not the role running this script).
-- ============================================================

-- ============================================================
-- Customer + brand auth users (handle_new_user creates their
-- public.customers / public.brands rows automatically from the
-- metadata below)
-- ============================================================
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values
  ('00000000-0000-0000-0000-000000000000', '999553a0-c4f6-411d-9559-70be02639fae', 'authenticated', 'authenticated', 'admin@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Admin User"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '9733860e-d677-4d54-a9ff-eca68b281c86', 'authenticated', 'authenticated', 'ada.balogun0@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Ada Balogun"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'e4c25901-1b9c-460d-99b7-56fb9beddabc', 'authenticated', 'authenticated', 'femi.adeyemi1@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Femi Adeyemi"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '34e8f5e6-5e0b-4187-8361-a022d3eea84c', 'authenticated', 'authenticated', 'ngozi.yusuf2@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Ngozi Yusuf"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '7fefef7d-ad97-4818-b085-c565e5dee7a9', 'authenticated', 'authenticated', 'chidi.chukwu3@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Chidi Chukwu"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '36be77a9-f2b8-4003-8b3a-89bd890b877b', 'authenticated', 'authenticated', 'uche.danjuma4@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Uche Danjuma"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'd614c44d-e1a3-4c0e-9120-3c425427ba30', 'authenticated', 'authenticated', 'blessing.suleiman5@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Blessing Suleiman"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'f0f5334e-9e23-4ef4-877b-7b66047d1d98', 'authenticated', 'authenticated', 'emeka.umeh6@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Emeka Umeh"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee', 'authenticated', 'authenticated', 'yetunde.eze7@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Yetunde Eze"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '755c1c3e-e864-4b1d-8c8e-04d35d83fca6', 'authenticated', 'authenticated', 'tunde.okonkwo8@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Tunde Okonkwo"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '191489c5-2380-4059-9f6f-c87df22d3ee6', 'authenticated', 'authenticated', 'aisha.nwosu9@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Aisha Nwosu"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'c7b3e855-3908-425f-9226-551ef3c308cc', 'authenticated', 'authenticated', 'ibrahim.afolabi10@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Ibrahim Afolabi"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '2295389a-a90e-4f23-8e73-a9aed2435f5b', 'authenticated', 'authenticated', 'chioma.nwachukwu11@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Chioma Nwachukwu"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', 'authenticated', 'authenticated', 'segun.nnamdi12@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Segun Nnamdi"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'b7c05461-8ee5-4299-9a25-b6a621aaabe0', 'authenticated', 'authenticated', 'amaka.obi13@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Amaka Obi"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a9b989a8-3588-4377-9bc0-11f7e9a9baf6', 'authenticated', 'authenticated', 'kunle.okafor14@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Kunle Okafor"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9', 'authenticated', 'authenticated', 'adirehouse@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role_id": 4, "brand_name": "Adire House", "brand_description": "Handcrafted adire and aso-oke, made in Abeokuta.", "brand_url": "https://adirehouse.ng", "brand_location": "Kaduna, Nigeria"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'authenticated', 'authenticated', 'asookeatelier@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role_id": 4, "brand_name": "Aso-Oke Atelier", "brand_description": "Woven aso-oke fabric and accessories, family workshop since 1998.", "brand_url": "https://asookeatelier.ng", "brand_location": "Lagos, Nigeria"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '661b88b3-51bd-41fc-b737-0e453672ef84', 'authenticated', 'authenticated', 'ankaraandco@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role_id": 4, "brand_name": "Ankara & Co", "brand_description": "Modern cuts in classic Ankara prints.", "brand_url": "https://ankaraandco.ng", "brand_location": "Ibadan, Nigeria"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'ae204962-c4c8-46ac-a2b6-67a6c9a5c00a', 'authenticated', 'authenticated', 'yorubaweave@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role_id": 4, "brand_name": "Yoruba Weave", "brand_description": "Traditional Yoruba textile techniques reimagined.", "brand_url": "https://yorubaweave.ng", "brand_location": "Lagos, Nigeria"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'authenticated', 'authenticated', 'lagosstreetwearco@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role_id": 4, "brand_name": "Lagos Streetwear Co", "brand_description": "Streetwear designed and sewn in Lagos.", "brand_url": "https://lagosstreetwearco.ng", "brand_location": "Warri, Nigeria"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '74da33e5-0d2d-40e1-abe1-cad84f18f029', 'authenticated', 'authenticated', '916apparel@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role_id": 4, "brand_name": "916 Apparel", "brand_description": "Independent streetwear label out of Surulere.", "brand_url": "https://916apparel.ng", "brand_location": "Owerri, Nigeria"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'authenticated', 'authenticated', 'naijadrip@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role_id": 4, "brand_name": "Naija Drip", "brand_description": "Bold graphic tees and outerwear.", "brand_url": "https://naijadrip.ng", "brand_location": "Abeokuta, Nigeria"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '6a6d8dd3-292f-4e93-8f57-0d912280b660', 'authenticated', 'authenticated', 'boardroomnigeria@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role_id": 4, "brand_name": "Boardroom Nigeria", "brand_description": "Tailored corporate wear for the modern Nigerian office.", "brand_url": "https://boardroomnigeria.ng", "brand_location": "Onitsha, Nigeria"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '38826031-aedf-43a7-856a-d0414fbd7d23', 'authenticated', 'authenticated', 'executivecuts@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role_id": 4, "brand_name": "Executive Cuts", "brand_description": "Bespoke and ready-to-wear suiting.", "brand_url": "https://executivecuts.ng", "brand_location": "Onitsha, Nigeria"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '722c7935-6528-4448-84e6-71c0e136fb09', 'authenticated', 'authenticated', 'beadandgold@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role_id": 4, "brand_name": "Bead & Gold", "brand_description": "Handmade coral and brass jewellery and accessories.", "brand_url": "https://beadandgold.ng", "brand_location": "Warri, Nigeria"}'::jsonb, now(), now(), '', '', '', '');

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), id, id::text,
       format('{"sub":"%s","email":"%s"}', id, email)::jsonb,
       'email', now(), now(), now()
from auth.users
where id in ('999553a0-c4f6-411d-9559-70be02639fae','9733860e-d677-4d54-a9ff-eca68b281c86','e4c25901-1b9c-460d-99b7-56fb9beddabc','34e8f5e6-5e0b-4187-8361-a022d3eea84c','7fefef7d-ad97-4818-b085-c565e5dee7a9','36be77a9-f2b8-4003-8b3a-89bd890b877b','d614c44d-e1a3-4c0e-9120-3c425427ba30','f0f5334e-9e23-4ef4-877b-7b66047d1d98','9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee','755c1c3e-e864-4b1d-8c8e-04d35d83fca6','191489c5-2380-4059-9f6f-c87df22d3ee6','c7b3e855-3908-425f-9226-551ef3c308cc','2295389a-a90e-4f23-8e73-a9aed2435f5b','e9aa9dfc-2d4a-4c8d-9135-32d97ba04421','b7c05461-8ee5-4299-9a25-b6a621aaabe0','a9b989a8-3588-4377-9bc0-11f7e9a9baf6','bfa329ee-bce2-4e3f-a4c7-810674e1ace9','1a26ae0d-027e-407d-86c1-2bf654a5ea10','661b88b3-51bd-41fc-b737-0e453672ef84','ae204962-c4c8-46ac-a2b6-67a6c9a5c00a','abcfe251-e889-4249-a67e-29e3b996aaf0','74da33e5-0d2d-40e1-abe1-cad84f18f029','16212d7b-629e-45dc-a5ac-c9eb86e74425','6a6d8dd3-292f-4e93-8f57-0d912280b660','38826031-aedf-43a7-856a-d0414fbd7d23','722c7935-6528-4448-84e6-71c0e136fb09');

-- Clean up the throwaway public.customers row + welcome notification
-- the trigger created for the admin account, then register it as an
-- actual admin.
delete from public.notifications where user_id = '999553a0-c4f6-411d-9559-70be02639fae';
delete from public.customers where id = '999553a0-c4f6-411d-9559-70be02639fae';

insert into public.admins (id, full_name, email) values
  ('999553a0-c4f6-411d-9559-70be02639fae', 'Admin User', 'admin@example.com');

-- Fill in fields the trigger doesn't populate
update public.customers set location = 'Uyo, Nigeria', phone_no = '+2348010000000' where id = '9733860e-d677-4d54-a9ff-eca68b281c86';
update public.customers set location = 'Abuja, Nigeria', phone_no = '+2348010000037' where id = 'e4c25901-1b9c-460d-99b7-56fb9beddabc';
update public.customers set location = 'Lagos, Nigeria', phone_no = '+2348010000074' where id = '34e8f5e6-5e0b-4187-8361-a022d3eea84c';
update public.customers set location = 'Warri, Nigeria', phone_no = '+2348010000111' where id = '7fefef7d-ad97-4818-b085-c565e5dee7a9';
update public.customers set location = 'Kano, Nigeria', phone_no = '+2348010000148' where id = '36be77a9-f2b8-4003-8b3a-89bd890b877b';
update public.customers set location = 'Ibadan, Nigeria', phone_no = '+2348010000185' where id = 'd614c44d-e1a3-4c0e-9120-3c425427ba30';
update public.customers set location = 'Ibadan, Nigeria', phone_no = '+2348010000222' where id = 'f0f5334e-9e23-4ef4-877b-7b66047d1d98';
update public.customers set location = 'Port Harcourt, Nigeria', phone_no = '+2348010000259' where id = '9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee';
update public.customers set location = 'Warri, Nigeria', phone_no = '+2348010000296' where id = '755c1c3e-e864-4b1d-8c8e-04d35d83fca6';
update public.customers set location = 'Abuja, Nigeria', phone_no = '+2348010000333' where id = '191489c5-2380-4059-9f6f-c87df22d3ee6';
update public.customers set location = 'Uyo, Nigeria', phone_no = '+2348010000370' where id = 'c7b3e855-3908-425f-9226-551ef3c308cc';
update public.customers set location = 'Warri, Nigeria', phone_no = '+2348010000407' where id = '2295389a-a90e-4f23-8e73-a9aed2435f5b';
update public.customers set location = 'Calabar, Nigeria', phone_no = '+2348010000444' where id = 'e9aa9dfc-2d4a-4c8d-9135-32d97ba04421';
update public.customers set location = 'Owerri, Nigeria', phone_no = '+2348010000481' where id = 'b7c05461-8ee5-4299-9a25-b6a621aaabe0';
update public.customers set location = 'Abuja, Nigeria', phone_no = '+2348010000518' where id = 'a9b989a8-3588-4377-9bc0-11f7e9a9baf6';

update public.brands set status = 'approved', commission_rate = 10.53, profile_picture = 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/brands.jpg', contact = '+2348220000000', paystack_subaccount_code = 'ACCT_adirehouse', payout_bank_code = '058', payout_account_number = '0398362082', payout_account_name = 'Adire House Ltd', payout_verified = true where id = 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9';
update public.brands set status = 'approved', commission_rate = 8.56, profile_picture = 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/brands.jpg', contact = '+2348220000041', paystack_subaccount_code = 'ACCT_asookeatelier', payout_bank_code = '058', payout_account_number = '0266944844', payout_account_name = 'Aso-Oke Atelier Ltd', payout_verified = true where id = '1a26ae0d-027e-407d-86c1-2bf654a5ea10';
update public.brands set status = 'pending', commission_rate = 11.03, profile_picture = 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/brands.jpg', contact = '+2348220000082', paystack_subaccount_code = null, payout_bank_code = null, payout_account_number = null, payout_account_name = null, payout_verified = false where id = '661b88b3-51bd-41fc-b737-0e453672ef84';
update public.brands set status = 'approved', commission_rate = 11.37, profile_picture = 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/brands.jpg', contact = '+2348220000123', paystack_subaccount_code = 'ACCT_yorubaweave', payout_bank_code = '058', payout_account_number = '0331191390', payout_account_name = 'Yoruba Weave Ltd', payout_verified = true where id = 'ae204962-c4c8-46ac-a2b6-67a6c9a5c00a';
update public.brands set status = 'approved', commission_rate = 11.9, profile_picture = 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/brands.jpg', contact = '+2348220000164', paystack_subaccount_code = 'ACCT_lagosstreetwearco', payout_bank_code = '058', payout_account_number = '0919795579', payout_account_name = 'Lagos Streetwear Co Ltd', payout_verified = true where id = 'abcfe251-e889-4249-a67e-29e3b996aaf0';
update public.brands set status = 'approved', commission_rate = 10.52, profile_picture = 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/brands.jpg', contact = '+2348220000205', paystack_subaccount_code = 'ACCT_916apparel', payout_bank_code = '058', payout_account_number = '0461415646', payout_account_name = '916 Apparel Ltd', payout_verified = true where id = '74da33e5-0d2d-40e1-abe1-cad84f18f029';
update public.brands set status = 'approved', commission_rate = 11.54, profile_picture = 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/brands.jpg', contact = '+2348220000246', paystack_subaccount_code = 'ACCT_naijadrip', payout_bank_code = '058', payout_account_number = '0209747451', payout_account_name = 'Naija Drip Ltd', payout_verified = true where id = '16212d7b-629e-45dc-a5ac-c9eb86e74425';
update public.brands set status = 'approved', commission_rate = 13.22, profile_picture = 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/brands.jpg', contact = '+2348220000287', paystack_subaccount_code = 'ACCT_boardroomnigeria', payout_bank_code = '058', payout_account_number = '0199585092', payout_account_name = 'Boardroom Nigeria Ltd', payout_verified = true where id = '6a6d8dd3-292f-4e93-8f57-0d912280b660';
update public.brands set status = 'pending', commission_rate = 12.83, profile_picture = 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/brands.jpg', contact = '+2348220000328', paystack_subaccount_code = null, payout_bank_code = null, payout_account_number = null, payout_account_name = null, payout_verified = false where id = '38826031-aedf-43a7-856a-d0414fbd7d23';
update public.brands set status = 'approved', commission_rate = 10.54, profile_picture = 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/brands.jpg', contact = '+2348220000369', paystack_subaccount_code = 'ACCT_beadandgold', payout_bank_code = '058', payout_account_number = '0507943839', payout_account_name = 'Bead & Gold Ltd', payout_verified = true where id = '722c7935-6528-4448-84e6-71c0e136fb09';

-- ============================================================
-- categories
-- ============================================================
insert into public.categories (name, slug, description) values
  ('Clothing', 'clothing', 'General apparel'),
  ('Footwear', 'footwear', 'Shoes and sandals'),
  ('Accessories', 'accessories', 'Bags, belts, and other accessories'),
  ('Jewellery', 'jewellery', 'Jewellery and adornments'),
  ('Bags', 'bags', 'Handbags and totes'),
  ('Kids', 'kids', 'Children''s clothing and accessories')
on conflict (slug) do nothing;

-- ============================================================
-- collections
-- ============================================================
insert into public.collections (id, brand_id, name, slug, description, category_id, display_image) values
  ('b0049bc3-5ab0-40fb-aca1-710cc1f41345', 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9', 'Adire House Signature Line', 'adire-house-signature-line-967', 'Curated pieces from Adire House Signature Line.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection.webp'),
  ('a4f0d14d-7d73-4e53-8d1e-6b87b5765f8d', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Aso-Oke Atelier Limited Edition', 'aso-oke-atelier-limited-edition-370', 'Curated pieces from Aso-Oke Atelier Limited Edition.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection2.png'),
  ('c1cd0dca-3f74-492f-8d7e-cdbcb8fed5d4', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Aso-Oke Atelier Heritage Collection', 'aso-oke-atelier-heritage-collection-847', 'Curated pieces from Aso-Oke Atelier Heritage Collection.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection3.jpeg'),
  ('6e79683a-5f68-42f0-8f7c-b50b5f601493', '661b88b3-51bd-41fc-b737-0e453672ef84', 'Ankara & Co Limited Edition', 'ankara-and-co-limited-edition-227', 'Curated pieces from Ankara & Co Limited Edition.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection4.webp'),
  ('c474867c-fa7d-4195-917f-b20a0571a739', '661b88b3-51bd-41fc-b737-0e453672ef84', 'Ankara & Co Essentials', 'ankara-and-co-essentials-180', 'Curated pieces from Ankara & Co Essentials.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection5.webp'),
  ('905d8f2d-30ba-4460-ae02-61f5428669fc', 'ae204962-c4c8-46ac-a2b6-67a6c9a5c00a', 'Yoruba Weave Everyday Collection', 'yoruba-weave-everyday-collection-733', 'Curated pieces from Yoruba Weave Everyday Collection.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection6.jpg'),
  ('beb87054-0d5d-4ac2-9941-fdcd67043ae4', 'ae204962-c4c8-46ac-a2b6-67a6c9a5c00a', 'Yoruba Weave Signature Line', 'yoruba-weave-signature-line-691', 'Curated pieces from Yoruba Weave Signature Line.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection.webp'),
  ('d12eceda-6f60-49b3-93ba-969858a81da5', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'Lagos Streetwear Co Everyday Collection', 'lagos-streetwear-co-everyday-collection-171', 'Curated pieces from Lagos Streetwear Co Everyday Collection.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection2.png'),
  ('0f8daa13-7049-477d-9242-85e59f9c0aec', '74da33e5-0d2d-40e1-abe1-cad84f18f029', '916 Apparel Everyday Collection', '916-apparel-everyday-collection-333', 'Curated pieces from 916 Apparel Everyday Collection.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection3.jpeg'),
  ('4e123090-2d65-4a73-b9dd-d8052292654d', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Naija Drip Heritage Collection', 'naija-drip-heritage-collection-975', 'Curated pieces from Naija Drip Heritage Collection.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection4.webp'),
  ('73478f09-670e-4be2-8984-7280d535c05e', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Naija Drip New Season Drop', 'naija-drip-new-season-drop-987', 'Curated pieces from Naija Drip New Season Drop.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection5.webp'),
  ('2c761cfc-86cd-451d-84f4-74d675304bfb', '6a6d8dd3-292f-4e93-8f57-0d912280b660', 'Boardroom Nigeria Essentials', 'boardroom-nigeria-essentials-384', 'Curated pieces from Boardroom Nigeria Essentials.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection6.jpg'),
  ('ac329d24-3e4a-437b-b4a1-30330f2eedd7', '38826031-aedf-43a7-856a-d0414fbd7d23', 'Executive Cuts Everyday Collection', 'executive-cuts-everyday-collection-954', 'Curated pieces from Executive Cuts Everyday Collection.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection.webp'),
  ('cf895cd1-860f-4c84-9e07-bb5a9f595283', '38826031-aedf-43a7-856a-d0414fbd7d23', 'Executive Cuts Signature Line', 'executive-cuts-signature-line-266', 'Curated pieces from Executive Cuts Signature Line.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection2.png'),
  ('ce474bc0-d223-4077-9e84-196d987071cb', '722c7935-6528-4448-84e6-71c0e136fb09', 'Bead & Gold Signature Line', 'bead-and-gold-signature-line-314', 'Curated pieces from Bead & Gold Signature Line.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection3.jpeg'),
  ('a3813905-6656-4917-9deb-c527d7bfd76b', '722c7935-6528-4448-84e6-71c0e136fb09', 'Bead & Gold Everyday Collection', 'bead-and-gold-everyday-collection-373', 'Curated pieces from Bead & Gold Everyday Collection.', (select id from public.categories where slug = 'clothing'), 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Collections/collection4.webp');

-- ============================================================
-- products
-- ============================================================
insert into public.products (id, brand_id, category_id, collection_id, name, slug, description, price, stock_quantity, product_images, features, specifications, free_shipping, return_days) values
  ('71d55adb-3fe8-4e1d-bf94-8b1eea00e81e', 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9', (select id from public.categories where slug = 'clothing'), 'b0049bc3-5ab0-40fb-aca1-710cc1f41345', 'Agbada Set', 'agbada-set-71d55a', 'Agbada Set, made in Nigeria.', 40000, 29, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-b.jpg'], ARRAY['Made in Nigeria','Hand-finished'], '{"material": "denim"}'::jsonb, true, 14),
  ('3ac61227-170e-4331-addc-0550f89f4b3c', 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9', (select id from public.categories where slug = 'clothing'), 'b0049bc3-5ab0-40fb-aca1-710cc1f41345', 'Indigo Adire Wrapper', 'indigo-adire-wrapper-3ac612', 'Indigo Adire Wrapper, made in Nigeria.', 28000, 8, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-c.jpg'], ARRAY['Made in Nigeria','Limited run'], '{"material": "cotton"}'::jsonb, true, 7),
  ('3c5962f2-0906-4dbb-bede-6099f5815afe', 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9', (select id from public.categories where slug = 'accessories'), 'b0049bc3-5ab0-40fb-aca1-710cc1f41345', 'Aso-Oke Gele', 'aso-oke-gele-3c5962', 'Aso-Oke Gele, made in Nigeria.', 17000, 22, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-a.jpg'], ARRAY['Made in Nigeria','Hand-finished'], '{"material": "leather"}'::jsonb, true, 14),
  ('6a3d1fcc-c8f2-442a-93a1-7118aed63867', 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9', (select id from public.categories where slug = 'clothing'), 'b0049bc3-5ab0-40fb-aca1-710cc1f41345', 'Ankara Print Dress', 'ankara-print-dress-6a3d1f', 'Ankara Print Dress, made in Nigeria.', 18000, 30, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-b.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "wool blend"}'::jsonb, false, 30),
  ('485d8fdb-562c-4b34-83fd-e45ec91159c5', 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9', (select id from public.categories where slug = 'clothing'), 'b0049bc3-5ab0-40fb-aca1-710cc1f41345', 'Iro and Buba', 'iro-and-buba-485d8f', 'Iro and Buba, made in Nigeria.', 26000, 13, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-c.jpg'], ARRAY['Made in Nigeria','Limited run'], '{"material": "aso-oke"}'::jsonb, true, 14),
  ('da06a8d1-5eb9-46df-9586-f807df7ac161', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', (select id from public.categories where slug = 'clothing'), 'c1cd0dca-3f74-492f-8d7e-cdbcb8fed5d4', 'Iro and Buba', 'iro-and-buba-da06a8', 'Iro and Buba, made in Nigeria.', 26000, 10, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-a.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "leather"}'::jsonb, false, 7),
  ('af1677e3-43ff-40c6-b9c0-f0277878d6de', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', (select id from public.categories where slug = 'clothing'), 'a4f0d14d-7d73-4e53-8d1e-6b87b5765f8d', 'Buba and Sokoto Set', 'buba-and-sokoto-set-af1677', 'Buba and Sokoto Set, made in Nigeria.', 24000, 48, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-b.jpg'], ARRAY['Made in Nigeria','Limited run'], '{"material": "denim"}'::jsonb, false, 7),
  ('74875566-861b-4e9a-a6e3-229b8fe2e999', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', (select id from public.categories where slug = 'clothing'), 'c1cd0dca-3f74-492f-8d7e-cdbcb8fed5d4', 'Agbada Set', 'agbada-set-748755', 'Agbada Set, made in Nigeria.', 47000, 43, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-c.jpg'], ARRAY['Made in Nigeria','Limited run'], '{"material": "aso-oke"}'::jsonb, false, 14),
  ('24b4e023-a791-40a8-866d-306e8f5d0e13', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', (select id from public.categories where slug = 'accessories'), 'a4f0d14d-7d73-4e53-8d1e-6b87b5765f8d', 'Aso-Oke Gele', 'aso-oke-gele-24b4e0', 'Aso-Oke Gele, made in Nigeria.', 20000, 48, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-a.jpg'], ARRAY['Made in Nigeria','Best seller'], '{"material": "wool blend"}'::jsonb, false, 14),
  ('5d9dd892-e749-41c9-9e36-7db86bda08da', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', (select id from public.categories where slug = 'clothing'), 'c1cd0dca-3f74-492f-8d7e-cdbcb8fed5d4', 'Indigo Adire Wrapper', 'indigo-adire-wrapper-5d9dd8', 'Indigo Adire Wrapper, made in Nigeria.', 30000, 12, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-b.jpg'], ARRAY['Made in Nigeria','Hand-finished'], '{"material": "cotton"}'::jsonb, true, 14),
  ('8e8dae54-43d8-4496-873a-70778eec86ca', '661b88b3-51bd-41fc-b737-0e453672ef84', (select id from public.categories where slug = 'clothing'), '6e79683a-5f68-42f0-8f7c-b50b5f601493', 'Indigo Adire Wrapper', 'indigo-adire-wrapper-8e8dae', 'Indigo Adire Wrapper, made in Nigeria.', 32000, 45, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-c.jpg'], ARRAY['Made in Nigeria','Best seller'], '{"material": "wool blend"}'::jsonb, true, 14),
  ('3dc72ac3-3a00-49b3-b569-400f52005195', '661b88b3-51bd-41fc-b737-0e453672ef84', (select id from public.categories where slug = 'clothing'), 'c474867c-fa7d-4195-917f-b20a0571a739', 'Ankara Print Dress', 'ankara-print-dress-3dc72a', 'Ankara Print Dress, made in Nigeria.', 17000, 15, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-a.jpg'], ARRAY['Made in Nigeria','Hand-finished'], '{"material": "cotton"}'::jsonb, false, 7),
  ('2113521c-a9f7-476e-b4cc-4dca03d33489', '661b88b3-51bd-41fc-b737-0e453672ef84', (select id from public.categories where slug = 'accessories'), 'c474867c-fa7d-4195-917f-b20a0571a739', 'Aso-Oke Gele', 'aso-oke-gele-211352', 'Aso-Oke Gele, made in Nigeria.', 21000, 36, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-b.jpg'], ARRAY['Made in Nigeria','Limited run'], '{"material": "denim"}'::jsonb, true, 14),
  ('430b64e4-2bd6-4a6c-945d-f6565f7c8b15', '661b88b3-51bd-41fc-b737-0e453672ef84', (select id from public.categories where slug = 'clothing'), '6e79683a-5f68-42f0-8f7c-b50b5f601493', 'Iro and Buba', 'iro-and-buba-430b64', 'Iro and Buba, made in Nigeria.', 31000, 8, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-c.jpg'], ARRAY['Made in Nigeria','Limited run'], '{"material": "denim"}'::jsonb, true, 7),
  ('fcb244f4-614e-4c38-bd53-8602b0223a77', 'ae204962-c4c8-46ac-a2b6-67a6c9a5c00a', (select id from public.categories where slug = 'clothing'), '905d8f2d-30ba-4460-ae02-61f5428669fc', 'Agbada Set', 'agbada-set-fcb244', 'Agbada Set, made in Nigeria.', 59000, 13, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-a.jpg'], ARRAY['Made in Nigeria','Best seller'], '{"material": "aso-oke"}'::jsonb, false, 14),
  ('87f03713-1d88-4f43-b55f-a9bdbbc5fcb7', 'ae204962-c4c8-46ac-a2b6-67a6c9a5c00a', (select id from public.categories where slug = 'clothing'), 'beb87054-0d5d-4ac2-9941-fdcd67043ae4', 'Buba and Sokoto Set', 'buba-and-sokoto-set-87f037', 'Buba and Sokoto Set, made in Nigeria.', 28000, 18, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-b.jpg'], ARRAY['Made in Nigeria','Best seller'], '{"material": "aso-oke"}'::jsonb, false, 14),
  ('34013143-9dbf-468d-8b02-ca7c8d35a98b', 'ae204962-c4c8-46ac-a2b6-67a6c9a5c00a', (select id from public.categories where slug = 'clothing'), 'beb87054-0d5d-4ac2-9941-fdcd67043ae4', 'Indigo Adire Wrapper', 'indigo-adire-wrapper-340131', 'Indigo Adire Wrapper, made in Nigeria.', 29000, 30, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-c.jpg'], ARRAY['Made in Nigeria','Hand-finished'], '{"material": "cotton"}'::jsonb, false, 14),
  ('ee1ecdd8-dbad-4969-9034-94be37d6854a', 'abcfe251-e889-4249-a67e-29e3b996aaf0', (select id from public.categories where slug = 'clothing'), 'd12eceda-6f60-49b3-93ba-969858a81da5', 'Graphic Hoodie', 'graphic-hoodie-ee1ecd', 'Graphic Hoodie, made in Nigeria.', 21000, 26, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-a.jpg'], ARRAY['Made in Nigeria','Hand-finished'], '{"material": "leather"}'::jsonb, true, 14),
  ('2b8c2864-a56f-4254-82de-e1121f58cd57', 'abcfe251-e889-4249-a67e-29e3b996aaf0', (select id from public.categories where slug = 'accessories'), 'd12eceda-6f60-49b3-93ba-969858a81da5', 'Bucket Hat', 'bucket-hat-2b8c28', 'Bucket Hat, made in Nigeria.', 9000, 5, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-b.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "aso-oke"}'::jsonb, true, 7),
  ('312f6462-a7b4-4474-b3a4-2996e6728309', 'abcfe251-e889-4249-a67e-29e3b996aaf0', (select id from public.categories where slug = 'clothing'), 'd12eceda-6f60-49b3-93ba-969858a81da5', 'Distressed Denim Jacket', 'distressed-denim-jacket-312f64', 'Distressed Denim Jacket, made in Nigeria.', 28000, 7, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-c.jpg'], ARRAY['Made in Nigeria','Hand-finished'], '{"material": "wool blend"}'::jsonb, false, 7),
  ('a780aa5d-2585-4cd6-9e38-008b8cb18a07', 'abcfe251-e889-4249-a67e-29e3b996aaf0', (select id from public.categories where slug = 'footwear'), 'd12eceda-6f60-49b3-93ba-969858a81da5', 'Canvas Slides', 'canvas-slides-a780aa', 'Canvas Slides, made in Nigeria.', 12000, 22, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-a.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "cotton blend"}'::jsonb, false, 14),
  ('5cc8d85b-dd99-45e0-ad1d-40f48a028008', '74da33e5-0d2d-40e1-abe1-cad84f18f029', (select id from public.categories where slug = 'clothing'), '0f8daa13-7049-477d-9242-85e59f9c0aec', 'Oversized Lagos Tee', 'oversized-lagos-tee-5cc8d8', 'Oversized Lagos Tee, made in Nigeria.', 15000, 17, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-b.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "cotton"}'::jsonb, true, 30),
  ('0e55c51e-5689-420a-986a-813586d09367', '74da33e5-0d2d-40e1-abe1-cad84f18f029', (select id from public.categories where slug = 'clothing'), '0f8daa13-7049-477d-9242-85e59f9c0aec', 'Graphic Hoodie', 'graphic-hoodie-0e55c5', 'Graphic Hoodie, made in Nigeria.', 23000, 31, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-c.jpg'], ARRAY['Made in Nigeria','Limited run'], '{"material": "wool blend"}'::jsonb, false, 7),
  ('b9cd9c94-3050-45c8-b2e6-14b8f33562ec', '74da33e5-0d2d-40e1-abe1-cad84f18f029', (select id from public.categories where slug = 'accessories'), '0f8daa13-7049-477d-9242-85e59f9c0aec', 'Bucket Hat', 'bucket-hat-b9cd9c', 'Bucket Hat, made in Nigeria.', 5000, 30, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-a.jpg'], ARRAY['Made in Nigeria','Hand-finished'], '{"material": "wool blend"}'::jsonb, false, 7),
  ('f7d780c4-59e2-41ee-8002-6afa7e2096a9', '74da33e5-0d2d-40e1-abe1-cad84f18f029', (select id from public.categories where slug = 'clothing'), '0f8daa13-7049-477d-9242-85e59f9c0aec', 'Distressed Denim Jacket', 'distressed-denim-jacket-f7d780', 'Distressed Denim Jacket, made in Nigeria.', 28000, 17, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-b.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "leather"}'::jsonb, false, 14),
  ('0352f3d3-8ab1-43e1-ae1f-22ac16ccb720', '74da33e5-0d2d-40e1-abe1-cad84f18f029', (select id from public.categories where slug = 'footwear'), '0f8daa13-7049-477d-9242-85e59f9c0aec', 'Canvas Slides', 'canvas-slides-0352f3', 'Canvas Slides, made in Nigeria.', 11000, 22, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-c.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "leather"}'::jsonb, false, 7),
  ('6da4b5e4-24b7-4102-a33f-2d676fb58548', '16212d7b-629e-45dc-a5ac-c9eb86e74425', (select id from public.categories where slug = 'clothing'), '4e123090-2d65-4a73-b9dd-d8052292654d', 'Graphic Hoodie', 'graphic-hoodie-6da4b5', 'Graphic Hoodie, made in Nigeria.', 26000, 10, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-a.jpg'], ARRAY['Made in Nigeria','Hand-finished'], '{"material": "wool blend"}'::jsonb, false, 14),
  ('6081ddc0-0d12-4851-9931-5709d455c0d3', '16212d7b-629e-45dc-a5ac-c9eb86e74425', (select id from public.categories where slug = 'clothing'), '73478f09-670e-4be2-8984-7280d535c05e', 'Distressed Denim Jacket', 'distressed-denim-jacket-6081dd', 'Distressed Denim Jacket, made in Nigeria.', 27000, 36, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-b.jpg'], ARRAY['Made in Nigeria','Best seller'], '{"material": "aso-oke"}'::jsonb, false, 30),
  ('818114bc-7923-4f85-9ccb-fc94216d5fc6', '16212d7b-629e-45dc-a5ac-c9eb86e74425', (select id from public.categories where slug = 'footwear'), '4e123090-2d65-4a73-b9dd-d8052292654d', 'Canvas Slides', 'canvas-slides-818114', 'Canvas Slides, made in Nigeria.', 8000, 29, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-c.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "denim"}'::jsonb, true, 30),
  ('54d8eee0-ab05-45c7-b3ed-475375a6c739', '16212d7b-629e-45dc-a5ac-c9eb86e74425', (select id from public.categories where slug = 'clothing'), '73478f09-670e-4be2-8984-7280d535c05e', 'Cargo Joggers', 'cargo-joggers-54d8ee', 'Cargo Joggers, made in Nigeria.', 18000, 23, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-a.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "denim"}'::jsonb, false, 30),
  ('f1e159ca-5f1c-4494-aa89-ae5df4e715ee', '6a6d8dd3-292f-4e93-8f57-0d912280b660', (select id from public.categories where slug = 'clothing'), '2c761cfc-86cd-451d-84f4-74d675304bfb', 'Slim Fit Trousers', 'slim-fit-trousers-f1e159', 'Slim Fit Trousers, made in Nigeria.', 20000, 25, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-b.jpg'], ARRAY['Made in Nigeria','Best seller'], '{"material": "cotton"}'::jsonb, true, 30),
  ('22c456ec-ebfb-4f5c-8ee6-613d70d21fb0', '6a6d8dd3-292f-4e93-8f57-0d912280b660', (select id from public.categories where slug = 'clothing'), '2c761cfc-86cd-451d-84f4-74d675304bfb', 'Formal Shirt', 'formal-shirt-22c456', 'Formal Shirt, made in Nigeria.', 20000, 8, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-c.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "leather"}'::jsonb, false, 7),
  ('6c8b2eaa-3b5f-4598-9d6c-1f5b2d951258', '6a6d8dd3-292f-4e93-8f57-0d912280b660', (select id from public.categories where slug = 'clothing'), '2c761cfc-86cd-451d-84f4-74d675304bfb', 'Waistcoat', 'waistcoat-6c8b2e', 'Waistcoat, made in Nigeria.', 17000, 43, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-a.jpg'], ARRAY['Made in Nigeria','Limited run'], '{"material": "cotton blend"}'::jsonb, true, 14),
  ('f5aa07ad-3090-476c-aaa1-5d3e7c2157c9', '38826031-aedf-43a7-856a-d0414fbd7d23', (select id from public.categories where slug = 'clothing'), 'ac329d24-3e4a-437b-b4a1-30330f2eedd7', 'Tailored Blazer', 'tailored-blazer-f5aa07', 'Tailored Blazer, made in Nigeria.', 39000, 31, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-b.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "wool blend"}'::jsonb, false, 14),
  ('53126d4a-df40-4545-82a1-949d99e4fea6', '38826031-aedf-43a7-856a-d0414fbd7d23', (select id from public.categories where slug = 'clothing'), 'ac329d24-3e4a-437b-b4a1-30330f2eedd7', 'Office Dress', 'office-dress-53126d', 'Office Dress, made in Nigeria.', 26000, 47, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-c.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "leather"}'::jsonb, false, 14),
  ('478833db-4bcf-4b90-a6a0-235907bfa39e', '38826031-aedf-43a7-856a-d0414fbd7d23', (select id from public.categories where slug = 'clothing'), 'cf895cd1-860f-4c84-9e07-bb5a9f595283', 'Slim Fit Trousers', 'slim-fit-trousers-478833', 'Slim Fit Trousers, made in Nigeria.', 24000, 13, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-a.jpg'], ARRAY['Made in Nigeria','Hand-finished'], '{"material": "cotton blend"}'::jsonb, false, 14),
  ('729fc78d-4a98-4dd2-85bf-b0d57666234e', '38826031-aedf-43a7-856a-d0414fbd7d23', (select id from public.categories where slug = 'clothing'), 'cf895cd1-860f-4c84-9e07-bb5a9f595283', 'Formal Shirt', 'formal-shirt-729fc7', 'Formal Shirt, made in Nigeria.', 19000, 9, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-1-b.jpg'], ARRAY['Made in Nigeria','Hand-finished'], '{"material": "cotton blend"}'::jsonb, true, 7),
  ('e12daf07-64d8-4ed5-b36e-2f30e7366b45', '722c7935-6528-4448-84e6-71c0e136fb09', (select id from public.categories where slug = 'accessories'), 'a3813905-6656-4917-9deb-c527d7bfd76b', 'Leather Tote Bag', 'leather-tote-bag-e12daf', 'Leather Tote Bag, made in Nigeria.', 29000, 9, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-b.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-2-c.jpg'], ARRAY['Made in Nigeria','Machine-stitched'], '{"material": "denim"}'::jsonb, false, 14),
  ('253fdd79-3673-4e4d-80f9-bf6a482d7f83', '722c7935-6528-4448-84e6-71c0e136fb09', (select id from public.categories where slug = 'accessories'), 'ce474bc0-d223-4077-9e84-196d987071cb', 'Ankara Clutch', 'ankara-clutch-253fdd', 'Ankara Clutch, made in Nigeria.', 13000, 33, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-c.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-3-a.jpg'], ARRAY['Made in Nigeria','Best seller'], '{"material": "wool blend"}'::jsonb, false, 14),
  ('02db2b98-212b-4037-b6e4-5a7a80cecfac', '722c7935-6528-4448-84e6-71c0e136fb09', (select id from public.categories where slug = 'jewellery'), 'ce474bc0-d223-4077-9e84-196d987071cb', 'Beaded Bracelet Set', 'beaded-bracelet-set-02db2b', 'Beaded Bracelet Set, made in Nigeria.', 8000, 47, ARRAY['http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-a.jpg','http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Brand%20Story/variant-4-b.jpg'], ARRAY['Made in Nigeria','Limited run'], '{"material": "denim"}'::jsonb, false, 14);

-- ============================================================
-- product_variants
-- ============================================================
insert into public.product_variants (id, product_id, size, color, stock_quantity) values
  ('7bd1a50c-1c90-414a-aae3-130f0bc742e6', '71d55adb-3fe8-4e1d-bf94-8b1eea00e81e', 'L', 'Cream', 4),
  ('16857649-12bd-4208-b640-32040ada9bee', '71d55adb-3fe8-4e1d-bf94-8b1eea00e81e', 'M', 'Cream', 13),
  ('47f326ed-81bc-4e28-ab9b-7618c63500f4', '3ac61227-170e-4331-addc-0550f89f4b3c', 'XXL', 'Black', 5),
  ('2edd2748-86de-410f-9e2a-d2107bfad6ec', '3ac61227-170e-4331-addc-0550f89f4b3c', 'XL', 'Cream', 7),
  ('c5cd51ba-36fa-4e8e-8ad6-a295746c77fe', '3ac61227-170e-4331-addc-0550f89f4b3c', 'M', 'Cream', 3),
  ('5a4cea47-9150-40fb-90cf-1359ff5eeb36', '3c5962f2-0906-4dbb-bede-6099f5815afe', 'M', 'Indigo', 14),
  ('27f7faaa-ea97-4b6e-bce2-d6d3992aa39b', '3c5962f2-0906-4dbb-bede-6099f5815afe', 'XXL', 'White', 10),
  ('dbe49ba7-5831-4832-9d1c-a9f50e53404a', '3c5962f2-0906-4dbb-bede-6099f5815afe', 'L', 'Black', 15),
  ('0234f33f-4828-482f-9b80-09f7fed0174f', '6a3d1fcc-c8f2-442a-93a1-7118aed63867', 'M', 'Indigo', 12),
  ('3ba61856-ee8d-4708-9ebf-c38bfbfea392', '6a3d1fcc-c8f2-442a-93a1-7118aed63867', 'L', 'Rust', 5),
  ('49649569-8064-4c1e-bcec-ecf89582ba11', 'da06a8d1-5eb9-46df-9586-f807df7ac161', 'XXL', 'Olive', 11),
  ('a146397b-e7d1-4be8-834b-9a0ec0d908e2', 'da06a8d1-5eb9-46df-9586-f807df7ac161', 'L', 'Navy', 8),
  ('7dc93beb-97ac-4fe6-a343-c55a87d45a22', 'da06a8d1-5eb9-46df-9586-f807df7ac161', 'M', 'Olive', 14),
  ('1138626c-bca2-4a7c-a8f0-d0393a36cea3', '24b4e023-a791-40a8-866d-306e8f5d0e13', 'L', 'Cream', 11),
  ('514211af-2ec8-4116-8254-45b04556fb3b', '24b4e023-a791-40a8-866d-306e8f5d0e13', 'XL', 'White', 15),
  ('6cda81ad-9678-48a6-ad4b-2456c1a7aba6', '24b4e023-a791-40a8-866d-306e8f5d0e13', 'XS', 'Rust', 16),
  ('933ff10e-9fd3-4faa-9bf5-eaac2de3a276', '5d9dd892-e749-41c9-9e36-7db86bda08da', 'XL', 'Navy', 4),
  ('f444d32f-7287-4a26-8784-d678cc496977', '5d9dd892-e749-41c9-9e36-7db86bda08da', 'L', 'Cream', 18),
  ('d6a48a32-a90d-4a69-83b6-31c46cd092e5', '3dc72ac3-3a00-49b3-b569-400f52005195', 'S', 'White', 8),
  ('179fb36d-5a7e-417a-9b2b-d96fd88e52a2', '3dc72ac3-3a00-49b3-b569-400f52005195', 'M', 'Navy', 2),
  ('6044751e-72dd-40f0-b78b-db16bd78b811', '2113521c-a9f7-476e-b4cc-4dca03d33489', 'XL', 'Olive', 20),
  ('20e713c8-3efb-4135-a0cd-85f673428e32', '2113521c-a9f7-476e-b4cc-4dca03d33489', 'XS', 'White', 14),
  ('e5bb43ee-20e3-494f-821f-40ec68bcb27c', '2113521c-a9f7-476e-b4cc-4dca03d33489', 'L', 'Burgundy', 14),
  ('d402262c-b2e3-4bb3-bcd4-137b26bcdab6', '430b64e4-2bd6-4a6c-945d-f6565f7c8b15', 'XS', 'White', 7),
  ('f0cd8c9b-3882-40e2-b784-a5f13999c376', '430b64e4-2bd6-4a6c-945d-f6565f7c8b15', 'L', 'Burgundy', 3),
  ('6fee0dd1-ea21-47f5-8583-946bc17ad19c', 'fcb244f4-614e-4c38-bd53-8602b0223a77', 'L', 'Burgundy', 18),
  ('17249d8a-a96f-4fc7-b92d-6bfbf2f719b8', 'fcb244f4-614e-4c38-bd53-8602b0223a77', 'S', 'Rust', 16),
  ('5cdc03e5-ba4a-46b3-95f2-0b3c28f0199c', '87f03713-1d88-4f43-b55f-a9bdbbc5fcb7', 'XL', 'Burgundy', 16),
  ('6aefee25-2ad0-4891-8d62-8a6772f250d6', '87f03713-1d88-4f43-b55f-a9bdbbc5fcb7', 'L', 'Cream', 9),
  ('e9171272-6044-4382-b11f-09b282a325cf', '87f03713-1d88-4f43-b55f-a9bdbbc5fcb7', 'S', 'Cream', 18),
  ('c61a40f4-188f-4d8f-bfca-8f09cac14a68', '34013143-9dbf-468d-8b02-ca7c8d35a98b', 'M', 'Indigo', 11),
  ('0ea474e7-382c-44b4-965a-0921715b8cbf', '34013143-9dbf-468d-8b02-ca7c8d35a98b', 'L', 'White', 10),
  ('d49206a1-f048-40ce-9369-962810c3c961', 'ee1ecdd8-dbad-4969-9034-94be37d6854a', 'S', 'White', 14),
  ('26ce25f1-58be-4797-9f63-e6b7ffe1c797', 'ee1ecdd8-dbad-4969-9034-94be37d6854a', 'XXL', 'Navy', 8),
  ('289c3919-2530-4d0e-9552-38546e6e0aad', '2b8c2864-a56f-4254-82de-e1121f58cd57', 'M', 'Olive', 3),
  ('cc4889fb-99e1-4623-ab06-d87fcb44499b', '2b8c2864-a56f-4254-82de-e1121f58cd57', 'XL', 'White', 15),
  ('892df5c3-1e41-4fbd-8668-8c21d119c9df', '2b8c2864-a56f-4254-82de-e1121f58cd57', 'L', 'Olive', 20),
  ('8570028a-f89d-406e-b111-46aab0ea2303', 'a780aa5d-2585-4cd6-9e38-008b8cb18a07', 'L', 'Cream', 14),
  ('421e88db-2aa6-48dc-ab14-bf78f661fb86', 'a780aa5d-2585-4cd6-9e38-008b8cb18a07', 'XS', 'Olive', 19),
  ('4496abbd-6600-486c-a408-d0d11e585f95', 'a780aa5d-2585-4cd6-9e38-008b8cb18a07', 'M', 'White', 17),
  ('a762ff26-ed0b-4c6f-adfd-07f1888ab6f5', '5cc8d85b-dd99-45e0-ad1d-40f48a028008', 'L', 'Rust', 14),
  ('6c995a12-3032-4458-bef1-32d774da08a9', '5cc8d85b-dd99-45e0-ad1d-40f48a028008', 'XS', 'Navy', 16),
  ('440755b5-9d4a-41bb-a9ce-904b0de9ebd4', '5cc8d85b-dd99-45e0-ad1d-40f48a028008', 'XXL', 'Navy', 19),
  ('a58fe185-1009-435b-a61d-65a6f008b5a4', '0e55c51e-5689-420a-986a-813586d09367', 'XL', 'Indigo', 15),
  ('a3847790-f6ee-4cd1-ac55-d5c2737e4e09', '0e55c51e-5689-420a-986a-813586d09367', 'XXL', 'Navy', 16),
  ('66159beb-662e-4f9c-9f5d-7e295bb28dc1', '0e55c51e-5689-420a-986a-813586d09367', 'XS', 'Navy', 3),
  ('72e0d38f-12d3-4b1d-b6da-84fb2e55d8af', 'b9cd9c94-3050-45c8-b2e6-14b8f33562ec', 'S', 'Rust', 14),
  ('f718a8fd-889c-4427-a418-4f9e09182861', 'b9cd9c94-3050-45c8-b2e6-14b8f33562ec', 'L', 'Cream', 15),
  ('04a5847d-150e-4816-ad5f-75be148f2df9', 'b9cd9c94-3050-45c8-b2e6-14b8f33562ec', 'M', 'Cream', 4),
  ('060a8f14-77c0-41b2-8060-5afa97ce698e', 'f7d780c4-59e2-41ee-8002-6afa7e2096a9', 'M', 'Indigo', 3),
  ('50932993-e2e2-4b5e-a247-24a89ab717e6', 'f7d780c4-59e2-41ee-8002-6afa7e2096a9', 'S', 'Black', 9),
  ('c87ffb47-6c8e-4e2a-b72d-c68bc0304b6b', '0352f3d3-8ab1-43e1-ae1f-22ac16ccb720', 'XL', 'White', 6),
  ('1942ac85-8458-4112-978e-c3cef69965d2', '0352f3d3-8ab1-43e1-ae1f-22ac16ccb720', 'S', 'Burgundy', 5),
  ('33d1a20d-e57e-4350-b3d6-bb8df9c3c7fa', '6da4b5e4-24b7-4102-a33f-2d676fb58548', 'L', 'Rust', 7),
  ('ee37abd9-cfd7-4ffb-81db-820b71af4341', '6da4b5e4-24b7-4102-a33f-2d676fb58548', 'M', 'Indigo', 7),
  ('302aa6e5-c488-4975-b739-590ca0960ac0', '818114bc-7923-4f85-9ccb-fc94216d5fc6', 'M', 'Olive', 14),
  ('6b18a208-05d2-424f-a401-30bd89990994', '818114bc-7923-4f85-9ccb-fc94216d5fc6', 'XL', 'White', 4),
  ('ed065be3-0b2f-4010-a0d5-09b01f0a8ba0', '54d8eee0-ab05-45c7-b3ed-475375a6c739', 'XS', 'Indigo', 20),
  ('0ea871d8-9533-4c60-b560-1464ffb377c8', '54d8eee0-ab05-45c7-b3ed-475375a6c739', 'M', 'Black', 13),
  ('6abd588e-bfde-433c-8191-e5be3a69eb23', 'f1e159ca-5f1c-4494-aa89-ae5df4e715ee', 'XS', 'Black', 15),
  ('b3053a92-1bce-4137-9730-e7ae902b10be', 'f1e159ca-5f1c-4494-aa89-ae5df4e715ee', 'XL', 'Burgundy', 5),
  ('a16781ad-09ab-49b6-96eb-0f2693b1527a', 'f1e159ca-5f1c-4494-aa89-ae5df4e715ee', 'M', 'Olive', 13),
  ('bd5d5dd8-b746-4519-9280-af64c290a0d6', '22c456ec-ebfb-4f5c-8ee6-613d70d21fb0', 'XXL', 'Navy', 18),
  ('b2c59dfd-25d7-4a19-b263-1b01710a657b', '22c456ec-ebfb-4f5c-8ee6-613d70d21fb0', 'S', 'Cream', 19),
  ('7598ddfd-df34-4245-b69b-99eaef2f9e79', '22c456ec-ebfb-4f5c-8ee6-613d70d21fb0', 'L', 'Burgundy', 16),
  ('90330d09-1eca-4e59-8467-8c413396b195', '6c8b2eaa-3b5f-4598-9d6c-1f5b2d951258', 'M', 'Cream', 16),
  ('cdfdafe6-4a39-4f56-bd08-f63928243125', '6c8b2eaa-3b5f-4598-9d6c-1f5b2d951258', 'S', 'White', 16),
  ('78b02660-8d9e-4000-843f-6b344eaeadff', '6c8b2eaa-3b5f-4598-9d6c-1f5b2d951258', 'XS', 'Olive', 12),
  ('a5292565-69ea-4fdb-87ca-cd2f5cb2d1e3', 'f5aa07ad-3090-476c-aaa1-5d3e7c2157c9', 'S', 'Rust', 10),
  ('7d4f03b2-8775-4f91-9d56-506d00822416', 'f5aa07ad-3090-476c-aaa1-5d3e7c2157c9', 'L', 'Rust', 10),
  ('4440da07-51be-448a-99a4-c590fe4c38a4', 'f5aa07ad-3090-476c-aaa1-5d3e7c2157c9', 'XXL', 'Cream', 19),
  ('c5d0406c-e657-4121-8b67-15b508f57154', '53126d4a-df40-4545-82a1-949d99e4fea6', 'XS', 'Olive', 17),
  ('48a9a3d0-7389-4c9d-85a4-9e1a3cb8c500', '53126d4a-df40-4545-82a1-949d99e4fea6', 'S', 'White', 17),
  ('b0574518-294f-4062-91e5-a1c7c7292f05', '478833db-4bcf-4b90-a6a0-235907bfa39e', 'L', 'Cream', 9),
  ('11efc4b8-1544-4b47-98ef-04a1bad610ca', '478833db-4bcf-4b90-a6a0-235907bfa39e', 'XS', 'Olive', 9),
  ('f8288613-aefb-4914-8ce9-e49dfc561196', '478833db-4bcf-4b90-a6a0-235907bfa39e', 'XL', 'Cream', 20),
  ('433099e9-84c1-4812-aeb2-d92b8e59c647', '729fc78d-4a98-4dd2-85bf-b0d57666234e', 'L', 'Rust', 16),
  ('c5f5183c-5c8e-4996-9ee4-20a9c21362b7', '729fc78d-4a98-4dd2-85bf-b0d57666234e', 'XL', 'Cream', 11),
  ('205c02fc-0289-45c1-8de8-a69e2279921d', '729fc78d-4a98-4dd2-85bf-b0d57666234e', 'M', 'Cream', 9),
  ('711390ea-d790-4949-9718-2783214d153a', 'e12daf07-64d8-4ed5-b36e-2f30e7366b45', 'M', 'Navy', 8),
  ('fe6fa989-d255-4df2-bde2-fd02aff18c5f', 'e12daf07-64d8-4ed5-b36e-2f30e7366b45', 'XS', 'White', 17),
  ('b6f592eb-d66b-46a1-a2be-5066c176824e', '253fdd79-3673-4e4d-80f9-bf6a482d7f83', 'XS', 'White', 13),
  ('e931f5d0-b763-4c85-9c40-b15838fd705b', '253fdd79-3673-4e4d-80f9-bf6a482d7f83', 'S', 'Navy', 11),
  ('79f172bf-e47e-4716-86b1-dd11983f783c', '253fdd79-3673-4e4d-80f9-bf6a482d7f83', 'M', 'Black', 19),
  ('a024cfe9-9d93-4fbd-b261-a301e0b40ae4', '02db2b98-212b-4037-b6e4-5a7a80cecfac', 'XS', 'Cream', 6),
  ('892b5140-b551-44ab-b255-47406e349acb', '02db2b98-212b-4037-b6e4-5a7a80cecfac', 'XL', 'Burgundy', 5);

-- ============================================================
-- cart
-- ============================================================
insert into public.cart (user_id, item_id, item_type, variant_id, quantity) values
  ('b7c05461-8ee5-4299-9a25-b6a621aaabe0', '71d55adb-3fe8-4e1d-bf94-8b1eea00e81e', 'product', '16857649-12bd-4208-b640-32040ada9bee', 2),
  ('9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee', '5cc8d85b-dd99-45e0-ad1d-40f48a028008', 'product', 'a762ff26-ed0b-4c6f-adfd-07f1888ab6f5', 2),
  ('b7c05461-8ee5-4299-9a25-b6a621aaabe0', 'f1e159ca-5f1c-4494-aa89-ae5df4e715ee', 'product', '6abd588e-bfde-433c-8191-e5be3a69eb23', 2),
  ('9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee', '485d8fdb-562c-4b34-83fd-e45ec91159c5', 'product', null, 3),
  ('c7b3e855-3908-425f-9226-551ef3c308cc', '6a3d1fcc-c8f2-442a-93a1-7118aed63867', 'product', '3ba61856-ee8d-4708-9ebf-c38bfbfea392', 1),
  ('7fefef7d-ad97-4818-b085-c565e5dee7a9', '74875566-861b-4e9a-a6e3-229b8fe2e999', 'product', null, 3),
  ('e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', '6da4b5e4-24b7-4102-a33f-2d676fb58548', 'product', '33d1a20d-e57e-4350-b3d6-bb8df9c3c7fa', 3),
  ('f0f5334e-9e23-4ef4-877b-7b66047d1d98', '818114bc-7923-4f85-9ccb-fc94216d5fc6', 'product', null, 2),
  ('b7c05461-8ee5-4299-9a25-b6a621aaabe0', 'e12daf07-64d8-4ed5-b36e-2f30e7366b45', 'product', null, 2),
  ('191489c5-2380-4059-9f6f-c87df22d3ee6', '02db2b98-212b-4037-b6e4-5a7a80cecfac', 'product', 'a024cfe9-9d93-4fbd-b261-a301e0b40ae4', 1),
  ('c7b3e855-3908-425f-9226-551ef3c308cc', '430b64e4-2bd6-4a6c-945d-f6565f7c8b15', 'product', 'd402262c-b2e3-4bb3-bcd4-137b26bcdab6', 1),
  ('7fefef7d-ad97-4818-b085-c565e5dee7a9', '3dc72ac3-3a00-49b3-b569-400f52005195', 'product', 'd6a48a32-a90d-4a69-83b6-31c46cd092e5', 1),
  ('f0f5334e-9e23-4ef4-877b-7b66047d1d98', '818114bc-7923-4f85-9ccb-fc94216d5fc6', 'product', '6b18a208-05d2-424f-a401-30bd89990994', 2),
  ('9733860e-d677-4d54-a9ff-eca68b281c86', 'fcb244f4-614e-4c38-bd53-8602b0223a77', 'product', '17249d8a-a96f-4fc7-b92d-6bfbf2f719b8', 3),
  ('b7c05461-8ee5-4299-9a25-b6a621aaabe0', '54d8eee0-ab05-45c7-b3ed-475375a6c739', 'product', 'ed065be3-0b2f-4010-a0d5-09b01f0a8ba0', 2),
  ('e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', 'e12daf07-64d8-4ed5-b36e-2f30e7366b45', 'product', '711390ea-d790-4949-9718-2783214d153a', 2),
  ('e4c25901-1b9c-460d-99b7-56fb9beddabc', '53126d4a-df40-4545-82a1-949d99e4fea6', 'product', 'c5d0406c-e657-4121-8b67-15b508f57154', 2),
  ('b7c05461-8ee5-4299-9a25-b6a621aaabe0', '5d9dd892-e749-41c9-9e36-7db86bda08da', 'product', '933ff10e-9fd3-4faa-9bf5-eaac2de3a276', 2);

-- ============================================================
-- orders, order_items, payment_splits
-- ============================================================
insert into public.orders (id, customer_id, status, total_amount, paystack_reference, shipping_address) values
  ('8a508a1e-d47a-4197-b716-67c93466877c', '191489c5-2380-4059-9f6f-c87df22d3ee6', 'pending', 110000, 'PSK_ref_8a508a1e', '{"recipient_name":"Aisha Nwosu","phone":"+2348010000333","address":"129 Awolowo Road","city":"Abuja","state":"Abuja"}'::jsonb),
  ('b42fb746-0f74-484c-9caf-b898c23543a7', '9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee', 'paid', 85000, 'PSK_ref_b42fb746', '{"recipient_name":"Yetunde Eze","phone":"+2348010000259","address":"133 Ikorodu Road","city":"Port Harcourt","state":"Port Harcourt"}'::jsonb),
  ('48291193-3765-4801-8faa-d5e6fd333e7f', 'a9b989a8-3588-4377-9bc0-11f7e9a9baf6', 'paid', 120000, 'PSK_ref_48291193', '{"recipient_name":"Kunle Okafor","phone":"+2348010000518","address":"74 Ikorodu Road","city":"Abuja","state":"Abuja"}'::jsonb),
  ('49dd7d54-bcac-487a-851f-cc7609887ef2', 'b7c05461-8ee5-4299-9a25-b6a621aaabe0', 'pending', 18000, 'PSK_ref_49dd7d54', '{"recipient_name":"Amaka Obi","phone":"+2348010000481","address":"30 Ikorodu Road","city":"Owerri","state":"Owerri"}'::jsonb),
  ('ceb97158-d9d3-4189-beaa-25ea88076223', 'b7c05461-8ee5-4299-9a25-b6a621aaabe0', 'paid', 114000, 'PSK_ref_ceb97158', '{"recipient_name":"Amaka Obi","phone":"+2348010000481","address":"179 Ikorodu Road","city":"Owerri","state":"Owerri"}'::jsonb),
  ('dc0cd916-0e41-422d-80df-271351b66827', 'e4c25901-1b9c-460d-99b7-56fb9beddabc', 'cancelled', 88000, 'PSK_ref_dc0cd916', '{"recipient_name":"Femi Adeyemi","phone":"+2348010000037","address":"119 Allen Avenue","city":"Abuja","state":"Abuja"}'::jsonb),
  ('a5f26081-dd94-4001-963c-65ba60408678', 'c7b3e855-3908-425f-9226-551ef3c308cc', 'paid', 35000, 'PSK_ref_a5f26081', '{"recipient_name":"Ibrahim Afolabi","phone":"+2348010000370","address":"49 Awolowo Road","city":"Uyo","state":"Uyo"}'::jsonb),
  ('c752cd82-9d98-4e7d-84e8-118b8a20afdb', '755c1c3e-e864-4b1d-8c8e-04d35d83fca6', 'paid', 42000, 'PSK_ref_c752cd82', '{"recipient_name":"Tunde Okonkwo","phone":"+2348010000296","address":"73 Ahmadu Bello Way","city":"Warri","state":"Warri"}'::jsonb),
  ('c572c47c-b2bc-4edf-9bb7-c3b9b0e57ceb', 'b7c05461-8ee5-4299-9a25-b6a621aaabe0', 'pending', 108000, 'PSK_ref_c572c47c', '{"recipient_name":"Amaka Obi","phone":"+2348010000481","address":"62 Awolowo Road","city":"Owerri","state":"Owerri"}'::jsonb),
  ('98a60dbf-8eb1-45b0-af9e-deca9ebafa2e', 'f0f5334e-9e23-4ef4-877b-7b66047d1d98', 'paid', 24000, 'PSK_ref_98a60dbf', '{"recipient_name":"Emeka Umeh","phone":"+2348010000222","address":"99 Adeola Odeku","city":"Ibadan","state":"Ibadan"}'::jsonb),
  ('8198bdf3-fa9c-41fc-87ed-5ffbd7e5ae58', '9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee', 'paid', 97000, 'PSK_ref_8198bdf3', '{"recipient_name":"Yetunde Eze","phone":"+2348010000259","address":"68 Ahmadu Bello Way","city":"Port Harcourt","state":"Port Harcourt"}'::jsonb),
  ('bf2c60be-4904-448d-af37-6cc6e0cecaed', '191489c5-2380-4059-9f6f-c87df22d3ee6', 'paid', 108000, 'PSK_ref_bf2c60be', '{"recipient_name":"Aisha Nwosu","phone":"+2348010000333","address":"192 Allen Avenue","city":"Abuja","state":"Abuja"}'::jsonb),
  ('592d6908-5505-428c-94e0-6775bcf601a3', 'f0f5334e-9e23-4ef4-877b-7b66047d1d98', 'cancelled', 120000, 'PSK_ref_592d6908', '{"recipient_name":"Emeka Umeh","phone":"+2348010000222","address":"92 Ahmadu Bello Way","city":"Ibadan","state":"Ibadan"}'::jsonb),
  ('0d7b3eca-2625-48e9-9d38-8fdf6315c7e3', 'f0f5334e-9e23-4ef4-877b-7b66047d1d98', 'paid', 62000, 'PSK_ref_0d7b3eca', '{"recipient_name":"Emeka Umeh","phone":"+2348010000222","address":"66 Allen Avenue","city":"Ibadan","state":"Ibadan"}'::jsonb),
  ('fd8c0386-6c2a-4b88-9124-b61ad4fb96d8', 'a9b989a8-3588-4377-9bc0-11f7e9a9baf6', 'pending', 90000, 'PSK_ref_fd8c0386', '{"recipient_name":"Kunle Okafor","phone":"+2348010000518","address":"164 Ikorodu Road","city":"Abuja","state":"Abuja"}'::jsonb),
  ('80ddc754-5875-447c-b5f3-c4da195bfb03', '2295389a-a90e-4f23-8e73-a9aed2435f5b', 'pending', 98000, 'PSK_ref_80ddc754', '{"recipient_name":"Chioma Nwachukwu","phone":"+2348010000407","address":"6 Ikorodu Road","city":"Warri","state":"Warri"}'::jsonb),
  ('6fe6888f-c622-4d67-9832-6c6d5000971a', '36be77a9-f2b8-4003-8b3a-89bd890b877b', 'pending', 69000, 'PSK_ref_6fe6888f', '{"recipient_name":"Uche Danjuma","phone":"+2348010000148","address":"65 Adeola Odeku","city":"Kano","state":"Kano"}'::jsonb),
  ('9a07b944-ba68-454c-b51e-b840ce60faf0', 'c7b3e855-3908-425f-9226-551ef3c308cc', 'cancelled', 53000, 'PSK_ref_9a07b944', '{"recipient_name":"Ibrahim Afolabi","phone":"+2348010000370","address":"84 Ikorodu Road","city":"Uyo","state":"Uyo"}'::jsonb);

insert into public.order_items (order_id, product_id, brand_id, product_name, unit_price, quantity, variant_id, status, vendor_amount) values
  ('8a508a1e-d47a-4197-b716-67c93466877c', '818114bc-7923-4f85-9ccb-fc94216d5fc6', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Canvas Slides', 8000, 2, '6b18a208-05d2-424f-a401-30bd89990994', 'pending', 14153.6),
  ('8a508a1e-d47a-4197-b716-67c93466877c', '74875566-861b-4e9a-a6e3-229b8fe2e999', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Agbada Set', 47000, 2, null, 'pending', 85953.6),
  ('b42fb746-0f74-484c-9caf-b898c23543a7', '3c5962f2-0906-4dbb-bede-6099f5815afe', 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9', 'Aso-Oke Gele', 17000, 2, '5a4cea47-9150-40fb-90cf-1359ff5eeb36', 'delivered', 30419.8),
  ('b42fb746-0f74-484c-9caf-b898c23543a7', '6081ddc0-0d12-4851-9931-5709d455c0d3', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Distressed Denim Jacket', 27000, 1, null, 'delivered', 23884.2),
  ('b42fb746-0f74-484c-9caf-b898c23543a7', 'a780aa5d-2585-4cd6-9e38-008b8cb18a07', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'Canvas Slides', 12000, 2, '8570028a-f89d-406e-b111-46aab0ea2303', 'shipped', 21144.0),
  ('48291193-3765-4801-8faa-d5e6fd333e7f', '6081ddc0-0d12-4851-9931-5709d455c0d3', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Distressed Denim Jacket', 27000, 2, null, 'shipped', 47768.4),
  ('48291193-3765-4801-8faa-d5e6fd333e7f', '22c456ec-ebfb-4f5c-8ee6-613d70d21fb0', '6a6d8dd3-292f-4e93-8f57-0d912280b660', 'Formal Shirt', 20000, 2, '7598ddfd-df34-4245-b69b-99eaef2f9e79', 'pending', 34712.0),
  ('48291193-3765-4801-8faa-d5e6fd333e7f', 'da06a8d1-5eb9-46df-9586-f807df7ac161', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Iro and Buba', 26000, 1, '7dc93beb-97ac-4fe6-a343-c55a87d45a22', 'shipped', 23774.4),
  ('49dd7d54-bcac-487a-851f-cc7609887ef2', '54d8eee0-ab05-45c7-b3ed-475375a6c739', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Cargo Joggers', 18000, 1, '0ea871d8-9533-4c60-b560-1464ffb377c8', 'pending', 15922.8),
  ('ceb97158-d9d3-4189-beaa-25ea88076223', '53126d4a-df40-4545-82a1-949d99e4fea6', '38826031-aedf-43a7-856a-d0414fbd7d23', 'Office Dress', 26000, 1, '48a9a3d0-7389-4c9d-85a4-9e1a3cb8c500', 'delivered', 22664.2),
  ('ceb97158-d9d3-4189-beaa-25ea88076223', '54d8eee0-ab05-45c7-b3ed-475375a6c739', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Cargo Joggers', 18000, 2, 'ed065be3-0b2f-4010-a0d5-09b01f0a8ba0', 'pending', 31845.6),
  ('ceb97158-d9d3-4189-beaa-25ea88076223', '6da4b5e4-24b7-4102-a33f-2d676fb58548', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Graphic Hoodie', 26000, 2, 'ee37abd9-cfd7-4ffb-81db-820b71af4341', 'shipped', 45999.2),
  ('dc0cd916-0e41-422d-80df-271351b66827', '87f03713-1d88-4f43-b55f-a9bdbbc5fcb7', 'ae204962-c4c8-46ac-a2b6-67a6c9a5c00a', 'Buba and Sokoto Set', 28000, 1, '5cdc03e5-ba4a-46b3-95f2-0b3c28f0199c', 'cancelled', 24816.4),
  ('dc0cd916-0e41-422d-80df-271351b66827', '8e8dae54-43d8-4496-873a-70778eec86ca', '661b88b3-51bd-41fc-b737-0e453672ef84', 'Indigo Adire Wrapper', 32000, 1, null, 'cancelled', 28470.4),
  ('dc0cd916-0e41-422d-80df-271351b66827', '312f6462-a7b4-4474-b3a4-2996e6728309', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'Distressed Denim Jacket', 28000, 1, null, 'cancelled', 24668.0),
  ('a5f26081-dd94-4001-963c-65ba60408678', '2b8c2864-a56f-4254-82de-e1121f58cd57', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'Bucket Hat', 9000, 2, 'cc4889fb-99e1-4623-ab06-d87fcb44499b', 'shipped', 15858.0),
  ('a5f26081-dd94-4001-963c-65ba60408678', '6c8b2eaa-3b5f-4598-9d6c-1f5b2d951258', '6a6d8dd3-292f-4e93-8f57-0d912280b660', 'Waistcoat', 17000, 1, '90330d09-1eca-4e59-8467-8c413396b195', 'shipped', 14752.6),
  ('c752cd82-9d98-4e7d-84e8-118b8a20afdb', 'ee1ecdd8-dbad-4969-9034-94be37d6854a', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'Graphic Hoodie', 21000, 2, '26ce25f1-58be-4797-9f63-e6b7ffe1c797', 'pending', 37002.0),
  ('c572c47c-b2bc-4edf-9bb7-c3b9b0e57ceb', '22c456ec-ebfb-4f5c-8ee6-613d70d21fb0', '6a6d8dd3-292f-4e93-8f57-0d912280b660', 'Formal Shirt', 20000, 2, '7598ddfd-df34-4245-b69b-99eaef2f9e79', 'pending', 34712.0),
  ('c572c47c-b2bc-4edf-9bb7-c3b9b0e57ceb', '5d9dd892-e749-41c9-9e36-7db86bda08da', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Indigo Adire Wrapper', 30000, 2, 'f444d32f-7287-4a26-8784-d678cc496977', 'pending', 54864.0),
  ('c572c47c-b2bc-4edf-9bb7-c3b9b0e57ceb', '818114bc-7923-4f85-9ccb-fc94216d5fc6', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Canvas Slides', 8000, 1, null, 'pending', 7076.8),
  ('98a60dbf-8eb1-45b0-af9e-deca9ebafa2e', 'a780aa5d-2585-4cd6-9e38-008b8cb18a07', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'Canvas Slides', 12000, 2, null, 'shipped', 21144.0),
  ('8198bdf3-fa9c-41fc-87ed-5ffbd7e5ae58', 'e12daf07-64d8-4ed5-b36e-2f30e7366b45', '722c7935-6528-4448-84e6-71c0e136fb09', 'Leather Tote Bag', 29000, 2, 'fe6fa989-d255-4df2-bde2-fd02aff18c5f', 'pending', 51886.8),
  ('8198bdf3-fa9c-41fc-87ed-5ffbd7e5ae58', '5cc8d85b-dd99-45e0-ad1d-40f48a028008', '74da33e5-0d2d-40e1-abe1-cad84f18f029', 'Oversized Lagos Tee', 15000, 1, '440755b5-9d4a-41bb-a9ce-904b0de9ebd4', 'pending', 13422.0),
  ('8198bdf3-fa9c-41fc-87ed-5ffbd7e5ae58', 'af1677e3-43ff-40c6-b9c0-f0277878d6de', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Buba and Sokoto Set', 24000, 1, null, 'shipped', 21945.6),
  ('bf2c60be-4904-448d-af37-6cc6e0cecaed', 'da06a8d1-5eb9-46df-9586-f807df7ac161', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Iro and Buba', 26000, 2, null, 'delivered', 47548.8),
  ('bf2c60be-4904-448d-af37-6cc6e0cecaed', '5cc8d85b-dd99-45e0-ad1d-40f48a028008', '74da33e5-0d2d-40e1-abe1-cad84f18f029', 'Oversized Lagos Tee', 15000, 2, null, 'pending', 26844.0),
  ('bf2c60be-4904-448d-af37-6cc6e0cecaed', '53126d4a-df40-4545-82a1-949d99e4fea6', '38826031-aedf-43a7-856a-d0414fbd7d23', 'Office Dress', 26000, 1, '48a9a3d0-7389-4c9d-85a4-9e1a3cb8c500', 'pending', 22664.2),
  ('592d6908-5505-428c-94e0-6775bcf601a3', 'af1677e3-43ff-40c6-b9c0-f0277878d6de', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Buba and Sokoto Set', 24000, 2, null, 'cancelled', 43891.2),
  ('592d6908-5505-428c-94e0-6775bcf601a3', '818114bc-7923-4f85-9ccb-fc94216d5fc6', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Canvas Slides', 8000, 1, '302aa6e5-c488-4975-b739-590ca0960ac0', 'cancelled', 7076.8),
  ('592d6908-5505-428c-94e0-6775bcf601a3', '8e8dae54-43d8-4496-873a-70778eec86ca', '661b88b3-51bd-41fc-b737-0e453672ef84', 'Indigo Adire Wrapper', 32000, 2, null, 'cancelled', 56940.8),
  ('0d7b3eca-2625-48e9-9d38-8fdf6315c7e3', '6da4b5e4-24b7-4102-a33f-2d676fb58548', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Graphic Hoodie', 26000, 1, 'ee37abd9-cfd7-4ffb-81db-820b71af4341', 'delivered', 22999.6),
  ('0d7b3eca-2625-48e9-9d38-8fdf6315c7e3', '729fc78d-4a98-4dd2-85bf-b0d57666234e', '38826031-aedf-43a7-856a-d0414fbd7d23', 'Formal Shirt', 19000, 1, '205c02fc-0289-45c1-8de8-a69e2279921d', 'pending', 16562.3),
  ('0d7b3eca-2625-48e9-9d38-8fdf6315c7e3', '3dc72ac3-3a00-49b3-b569-400f52005195', '661b88b3-51bd-41fc-b737-0e453672ef84', 'Ankara Print Dress', 17000, 1, '179fb36d-5a7e-417a-9b2b-d96fd88e52a2', 'shipped', 15124.9),
  ('fd8c0386-6c2a-4b88-9124-b61ad4fb96d8', '53126d4a-df40-4545-82a1-949d99e4fea6', '38826031-aedf-43a7-856a-d0414fbd7d23', 'Office Dress', 26000, 1, '48a9a3d0-7389-4c9d-85a4-9e1a3cb8c500', 'pending', 22664.2),
  ('fd8c0386-6c2a-4b88-9124-b61ad4fb96d8', '8e8dae54-43d8-4496-873a-70778eec86ca', '661b88b3-51bd-41fc-b737-0e453672ef84', 'Indigo Adire Wrapper', 32000, 2, null, 'pending', 56940.8),
  ('80ddc754-5875-447c-b5f3-c4da195bfb03', '2113521c-a9f7-476e-b4cc-4dca03d33489', '661b88b3-51bd-41fc-b737-0e453672ef84', 'Aso-Oke Gele', 21000, 2, '20e713c8-3efb-4135-a0cd-85f673428e32', 'pending', 37367.4),
  ('80ddc754-5875-447c-b5f3-c4da195bfb03', 'f7d780c4-59e2-41ee-8002-6afa7e2096a9', '74da33e5-0d2d-40e1-abe1-cad84f18f029', 'Distressed Denim Jacket', 28000, 2, '50932993-e2e2-4b5e-a247-24a89ab717e6', 'pending', 50108.8),
  ('6fe6888f-c622-4d67-9832-6c6d5000971a', '6a3d1fcc-c8f2-442a-93a1-7118aed63867', 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9', 'Ankara Print Dress', 18000, 2, null, 'pending', 32209.2),
  ('6fe6888f-c622-4d67-9832-6c6d5000971a', '253fdd79-3673-4e4d-80f9-bf6a482d7f83', '722c7935-6528-4448-84e6-71c0e136fb09', 'Ankara Clutch', 13000, 1, 'e931f5d0-b763-4c85-9c40-b15838fd705b', 'pending', 11629.8),
  ('6fe6888f-c622-4d67-9832-6c6d5000971a', '22c456ec-ebfb-4f5c-8ee6-613d70d21fb0', '6a6d8dd3-292f-4e93-8f57-0d912280b660', 'Formal Shirt', 20000, 1, '7598ddfd-df34-4245-b69b-99eaef2f9e79', 'pending', 17356.0),
  ('9a07b944-ba68-454c-b51e-b840ce60faf0', '3c5962f2-0906-4dbb-bede-6099f5815afe', 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9', 'Aso-Oke Gele', 17000, 1, 'dbe49ba7-5831-4832-9d1c-a9f50e53404a', 'cancelled', 15209.9),
  ('9a07b944-ba68-454c-b51e-b840ce60faf0', '312f6462-a7b4-4474-b3a4-2996e6728309', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'Distressed Denim Jacket', 28000, 1, null, 'cancelled', 24668.0),
  ('9a07b944-ba68-454c-b51e-b840ce60faf0', '818114bc-7923-4f85-9ccb-fc94216d5fc6', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Canvas Slides', 8000, 1, null, 'cancelled', 7076.8);

insert into public.payment_splits (order_id, brand_id, subaccount_code, gross_amount, commission_amount, net_amount) values
  ('b42fb746-0f74-484c-9caf-b898c23543a7', 'bfa329ee-bce2-4e3f-a4c7-810674e1ace9', 'ACCT_adirehouse', 34000, 3580.2, 30419.8),
  ('b42fb746-0f74-484c-9caf-b898c23543a7', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'ACCT_naijadrip', 27000, 3115.8, 23884.2),
  ('b42fb746-0f74-484c-9caf-b898c23543a7', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'ACCT_lagosstreetwearco', 24000, 2856.0, 21144.0),
  ('48291193-3765-4801-8faa-d5e6fd333e7f', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'ACCT_naijadrip', 54000, 6231.6, 47768.4),
  ('48291193-3765-4801-8faa-d5e6fd333e7f', '6a6d8dd3-292f-4e93-8f57-0d912280b660', 'ACCT_boardroomnigeria', 40000, 5288.0, 34712.0),
  ('48291193-3765-4801-8faa-d5e6fd333e7f', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'ACCT_asookeatelier', 26000, 2225.6, 23774.4),
  ('ceb97158-d9d3-4189-beaa-25ea88076223', '38826031-aedf-43a7-856a-d0414fbd7d23', 'ACCT_executivecuts', 26000, 3335.8, 22664.2),
  ('ceb97158-d9d3-4189-beaa-25ea88076223', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'ACCT_naijadrip', 88000, 10155.2, 77844.8),
  ('a5f26081-dd94-4001-963c-65ba60408678', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'ACCT_lagosstreetwearco', 18000, 2142.0, 15858.0),
  ('a5f26081-dd94-4001-963c-65ba60408678', '6a6d8dd3-292f-4e93-8f57-0d912280b660', 'ACCT_boardroomnigeria', 17000, 2247.4, 14752.6),
  ('c752cd82-9d98-4e7d-84e8-118b8a20afdb', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'ACCT_lagosstreetwearco', 42000, 4998.0, 37002.0),
  ('98a60dbf-8eb1-45b0-af9e-deca9ebafa2e', 'abcfe251-e889-4249-a67e-29e3b996aaf0', 'ACCT_lagosstreetwearco', 24000, 2856.0, 21144.0),
  ('8198bdf3-fa9c-41fc-87ed-5ffbd7e5ae58', '722c7935-6528-4448-84e6-71c0e136fb09', 'ACCT_beadandgold', 58000, 6113.2, 51886.8),
  ('8198bdf3-fa9c-41fc-87ed-5ffbd7e5ae58', '74da33e5-0d2d-40e1-abe1-cad84f18f029', 'ACCT_916apparel', 15000, 1578.0, 13422.0),
  ('8198bdf3-fa9c-41fc-87ed-5ffbd7e5ae58', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'ACCT_asookeatelier', 24000, 2054.4, 21945.6),
  ('bf2c60be-4904-448d-af37-6cc6e0cecaed', '1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'ACCT_asookeatelier', 52000, 4451.2, 47548.8),
  ('bf2c60be-4904-448d-af37-6cc6e0cecaed', '74da33e5-0d2d-40e1-abe1-cad84f18f029', 'ACCT_916apparel', 30000, 3156.0, 26844.0),
  ('bf2c60be-4904-448d-af37-6cc6e0cecaed', '38826031-aedf-43a7-856a-d0414fbd7d23', 'ACCT_executivecuts', 26000, 3335.8, 22664.2),
  ('0d7b3eca-2625-48e9-9d38-8fdf6315c7e3', '16212d7b-629e-45dc-a5ac-c9eb86e74425', 'ACCT_naijadrip', 26000, 3000.4, 22999.6),
  ('0d7b3eca-2625-48e9-9d38-8fdf6315c7e3', '38826031-aedf-43a7-856a-d0414fbd7d23', 'ACCT_executivecuts', 19000, 2437.7, 16562.3),
  ('0d7b3eca-2625-48e9-9d38-8fdf6315c7e3', '661b88b3-51bd-41fc-b737-0e453672ef84', 'ACCT_ankaraandco', 17000, 1875.1, 15124.9);

-- ============================================================
-- reviews
-- ============================================================
insert into public.reviews (product_id, user_id, reviewer_name, rating, review_text) values
  ('3dc72ac3-3a00-49b3-b569-400f52005195', '7fefef7d-ad97-4818-b085-c565e5dee7a9', 'Chidi C.', 4, 'Solid piece, gets compliments every time.'),
  ('f5aa07ad-3090-476c-aaa1-5d3e7c2157c9', '755c1c3e-e864-4b1d-8c8e-04d35d83fca6', 'Tunde O.', 4, 'Fast delivery and beautiful craftsmanship.'),
  ('34013143-9dbf-468d-8b02-ca7c8d35a98b', 'a9b989a8-3588-4377-9bc0-11f7e9a9baf6', 'Kunle O.', 5, 'Loved the fabric, a bit pricey though.'),
  ('5cc8d85b-dd99-45e0-ad1d-40f48a028008', 'e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', 'Segun N.', 3, 'Perfect fit and finish.'),
  ('485d8fdb-562c-4b34-83fd-e45ec91159c5', '34e8f5e6-5e0b-4187-8361-a022d3eea84c', 'Ngozi Y.', 4, 'Delivery took a while but the product was worth it.'),
  ('478833db-4bcf-4b90-a6a0-235907bfa39e', 'd614c44d-e1a3-4c0e-9120-3c425427ba30', 'Blessing S.', 3, 'Delivery took a while but the product was worth it.'),
  ('71d55adb-3fe8-4e1d-bf94-8b1eea00e81e', '36be77a9-f2b8-4003-8b3a-89bd890b877b', 'Uche D.', 5, 'Fits true to size, will buy again.'),
  ('54d8eee0-ab05-45c7-b3ed-475375a6c739', 'd614c44d-e1a3-4c0e-9120-3c425427ba30', 'Blessing S.', 5, 'Loved the fabric, a bit pricey though.'),
  ('e12daf07-64d8-4ed5-b36e-2f30e7366b45', 'f0f5334e-9e23-4ef4-877b-7b66047d1d98', 'Emeka U.', 5, 'Solid piece, gets compliments every time.'),
  ('af1677e3-43ff-40c6-b9c0-f0277878d6de', 'c7b3e855-3908-425f-9226-551ef3c308cc', 'Ibrahim A.', 4, 'Perfect fit and finish.'),
  ('3ac61227-170e-4331-addc-0550f89f4b3c', '191489c5-2380-4059-9f6f-c87df22d3ee6', 'Aisha N.', 5, 'Solid piece, gets compliments every time.'),
  ('02db2b98-212b-4037-b6e4-5a7a80cecfac', '7fefef7d-ad97-4818-b085-c565e5dee7a9', 'Chidi C.', 5, 'Fits true to size, will buy again.'),
  ('54d8eee0-ab05-45c7-b3ed-475375a6c739', 'a9b989a8-3588-4377-9bc0-11f7e9a9baf6', 'Kunle O.', 5, 'Loved the fabric, a bit pricey though.'),
  ('6da4b5e4-24b7-4102-a33f-2d676fb58548', 'e4c25901-1b9c-460d-99b7-56fb9beddabc', 'Femi A.', 4, 'Exactly as pictured, great quality.'),
  ('3c5962f2-0906-4dbb-bede-6099f5815afe', '36be77a9-f2b8-4003-8b3a-89bd890b877b', 'Uche D.', 5, 'Fits true to size, will buy again.'),
  ('af1677e3-43ff-40c6-b9c0-f0277878d6de', '7fefef7d-ad97-4818-b085-c565e5dee7a9', 'Chidi C.', 5, 'Fast delivery and beautiful craftsmanship.'),
  ('f7d780c4-59e2-41ee-8002-6afa7e2096a9', '9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee', 'Yetunde E.', 4, 'Delivery took a while but the product was worth it.'),
  ('e12daf07-64d8-4ed5-b36e-2f30e7366b45', '2295389a-a90e-4f23-8e73-a9aed2435f5b', 'Chioma N.', 5, 'Fast delivery and beautiful craftsmanship.'),
  ('6da4b5e4-24b7-4102-a33f-2d676fb58548', 'c7b3e855-3908-425f-9226-551ef3c308cc', 'Ibrahim A.', 3, 'Perfect fit and finish.'),
  ('02db2b98-212b-4037-b6e4-5a7a80cecfac', 'f0f5334e-9e23-4ef4-877b-7b66047d1d98', 'Emeka U.', 4, 'Exactly as pictured, great quality.'),
  ('b9cd9c94-3050-45c8-b2e6-14b8f33562ec', '7fefef7d-ad97-4818-b085-c565e5dee7a9', 'Chidi C.', 5, 'Perfect fit and finish.'),
  ('87f03713-1d88-4f43-b55f-a9bdbbc5fcb7', 'b7c05461-8ee5-4299-9a25-b6a621aaabe0', 'Amaka O.', 4, 'Fits true to size, will buy again.'),
  ('b9cd9c94-3050-45c8-b2e6-14b8f33562ec', '755c1c3e-e864-4b1d-8c8e-04d35d83fca6', 'Tunde O.', 5, 'Solid piece, gets compliments every time.'),
  ('6a3d1fcc-c8f2-442a-93a1-7118aed63867', 'f0f5334e-9e23-4ef4-877b-7b66047d1d98', 'Emeka U.', 4, 'Good value for the price.'),
  ('74875566-861b-4e9a-a6e3-229b8fe2e999', 'b7c05461-8ee5-4299-9a25-b6a621aaabe0', 'Amaka O.', 5, 'Fits true to size, will buy again.'),
  ('430b64e4-2bd6-4a6c-945d-f6565f7c8b15', 'c7b3e855-3908-425f-9226-551ef3c308cc', 'Ibrahim A.', 5, 'Exactly as pictured, great quality.'),
  ('6a3d1fcc-c8f2-442a-93a1-7118aed63867', 'e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', 'Segun N.', 4, 'Good value for the price.'),
  ('24b4e023-a791-40a8-866d-306e8f5d0e13', 'e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', 'Segun N.', 5, 'Good value for the price.'),
  ('485d8fdb-562c-4b34-83fd-e45ec91159c5', 'b7c05461-8ee5-4299-9a25-b6a621aaabe0', 'Amaka O.', 5, 'Good value for the price.'),
  ('e12daf07-64d8-4ed5-b36e-2f30e7366b45', '7fefef7d-ad97-4818-b085-c565e5dee7a9', 'Chidi C.', 4, 'Solid piece, gets compliments every time.');

-- ============================================================
-- bookmarks
-- ============================================================
insert into public.bookmarks (user_id, target_id, target_type) values
  ('e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', '5d9dd892-e749-41c9-9e36-7db86bda08da', 'product'),
  ('e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', '253fdd79-3673-4e4d-80f9-bf6a482d7f83', 'product'),
  ('9733860e-d677-4d54-a9ff-eca68b281c86', 'ee1ecdd8-dbad-4969-9034-94be37d6854a', 'product'),
  ('b7c05461-8ee5-4299-9a25-b6a621aaabe0', '5d9dd892-e749-41c9-9e36-7db86bda08da', 'product'),
  ('34e8f5e6-5e0b-4187-8361-a022d3eea84c', '53126d4a-df40-4545-82a1-949d99e4fea6', 'product'),
  ('36be77a9-f2b8-4003-8b3a-89bd890b877b', '3dc72ac3-3a00-49b3-b569-400f52005195', 'product'),
  ('e4c25901-1b9c-460d-99b7-56fb9beddabc', '3ac61227-170e-4331-addc-0550f89f4b3c', 'product'),
  ('34e8f5e6-5e0b-4187-8361-a022d3eea84c', '71d55adb-3fe8-4e1d-bf94-8b1eea00e81e', 'product'),
  ('d614c44d-e1a3-4c0e-9120-3c425427ba30', '87f03713-1d88-4f43-b55f-a9bdbbc5fcb7', 'product'),
  ('191489c5-2380-4059-9f6f-c87df22d3ee6', 'a780aa5d-2585-4cd6-9e38-008b8cb18a07', 'product'),
  ('9733860e-d677-4d54-a9ff-eca68b281c86', '3dc72ac3-3a00-49b3-b569-400f52005195', 'product'),
  ('36be77a9-f2b8-4003-8b3a-89bd890b877b', '6a3d1fcc-c8f2-442a-93a1-7118aed63867', 'product'),
  ('34e8f5e6-5e0b-4187-8361-a022d3eea84c', '6da4b5e4-24b7-4102-a33f-2d676fb58548', 'product'),
  ('755c1c3e-e864-4b1d-8c8e-04d35d83fca6', '74875566-861b-4e9a-a6e3-229b8fe2e999', 'product'),
  ('2295389a-a90e-4f23-8e73-a9aed2435f5b', '485d8fdb-562c-4b34-83fd-e45ec91159c5', 'product'),
  ('9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee', '818114bc-7923-4f85-9ccb-fc94216d5fc6', 'product'),
  ('e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', 'b9cd9c94-3050-45c8-b2e6-14b8f33562ec', 'product'),
  ('755c1c3e-e864-4b1d-8c8e-04d35d83fca6', 'e12daf07-64d8-4ed5-b36e-2f30e7366b45', 'product'),
  ('e4c25901-1b9c-460d-99b7-56fb9beddabc', '818114bc-7923-4f85-9ccb-fc94216d5fc6', 'product'),
  ('755c1c3e-e864-4b1d-8c8e-04d35d83fca6', 'fcb244f4-614e-4c38-bd53-8602b0223a77', 'product');

-- ============================================================
-- notifications
-- Note: public.customers_insert_notify() already fires a 'welcome'
-- notification per customer above - these are additional, later ones.
-- ============================================================
insert into public.notifications (user_id, type, title, message, is_read) values
  ('191489c5-2380-4059-9f6f-c87df22d3ee6', 'order_status', 'Your order has shipped', 'Your order is on its way.', false),
  ('e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', 'promo', 'New drop from a brand you follow', 'Check out the latest collection now live.', false),
  ('c7b3e855-3908-425f-9226-551ef3c308cc', 'order_status', 'Your order has shipped', 'Your order is on its way.', true),
  ('9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee', 'order_status', 'Order confirmed', 'We''ve received your order and payment.', false),
  ('c7b3e855-3908-425f-9226-551ef3c308cc', 'order_status', 'Your order has shipped', 'Your order is on its way.', false),
  ('2295389a-a90e-4f23-8e73-a9aed2435f5b', 'order_status', 'Order confirmed', 'We''ve received your order and payment.', true),
  ('a9b989a8-3588-4377-9bc0-11f7e9a9baf6', 'order_status', 'Your order has shipped', 'Your order is on its way.', false),
  ('191489c5-2380-4059-9f6f-c87df22d3ee6', 'order_status', 'Your order was delivered', 'Your order has been delivered, we hope you love it.', true),
  ('34e8f5e6-5e0b-4187-8361-a022d3eea84c', 'promo', 'New drop from a brand you follow', 'Check out the latest collection now live.', false),
  ('c7b3e855-3908-425f-9226-551ef3c308cc', 'promo', 'New drop from a brand you follow', 'Check out the latest collection now live.', false),
  ('191489c5-2380-4059-9f6f-c87df22d3ee6', 'promo', 'New drop from a brand you follow', 'Check out the latest collection now live.', false),
  ('755c1c3e-e864-4b1d-8c8e-04d35d83fca6', 'order_status', 'Order confirmed', 'We''ve received your order and payment.', true),
  ('e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', 'order_status', 'Your order has shipped', 'Your order is on its way.', false),
  ('c7b3e855-3908-425f-9226-551ef3c308cc', 'order_status', 'Your order was delivered', 'Your order has been delivered, we hope you love it.', false),
  ('9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee', 'order_status', 'Your order was delivered', 'Your order has been delivered, we hope you love it.', false),
  ('d614c44d-e1a3-4c0e-9120-3c425427ba30', 'order_status', 'Order confirmed', 'We''ve received your order and payment.', false),
  ('f0f5334e-9e23-4ef4-877b-7b66047d1d98', 'order_status', 'Your order has shipped', 'Your order is on its way.', false),
  ('f0f5334e-9e23-4ef4-877b-7b66047d1d98', 'promo', 'New drop from a brand you follow', 'Check out the latest collection now live.', false),
  ('36be77a9-f2b8-4003-8b3a-89bd890b877b', 'promo', 'New drop from a brand you follow', 'Check out the latest collection now live.', true),
  ('c7b3e855-3908-425f-9226-551ef3c308cc', 'order_status', 'Order confirmed', 'We''ve received your order and payment.', true);

-- ============================================================
-- events
-- ============================================================
insert into public.events (brand_id, title, slug, description, start_date, location, capacity, admission_price, display_image) values
  ('1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Aso-Oke Atelier Pop-Up Market', 'aso-oke-atelier-pop-up-market-195', 'Join us for Aso-Oke Atelier Pop-Up Market in Lagos.', now() + interval '32 days', 'Abuja, Nigeria', 125, 2000, 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/events.jpg'),
  ('661b88b3-51bd-41fc-b737-0e453672ef84', 'Ankara & Co Sample Sale', 'ankara-and-co-sample-sale-161', 'Join us for Ankara & Co Sample Sale in Ibadan.', now() + interval '42 days', 'Owerri, Nigeria', 101, 2000, 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/events.jpg'),
  ('1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Aso-Oke Atelier Style Workshop', 'aso-oke-atelier-style-workshop-462', 'Join us for Aso-Oke Atelier Style Workshop in Lagos.', now() + interval '60 days', 'Uyo, Nigeria', 150, 5000, 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/events.jpg'),
  ('bfa329ee-bce2-4e3f-a4c7-810674e1ace9', 'Adire House New Collection Launch', 'adire-house-new-collection-launch-714', 'Join us for Adire House New Collection Launch in Kaduna.', now() + interval '24 days', 'Enugu, Nigeria', 43, 0, 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/events.jpg'),
  ('661b88b3-51bd-41fc-b737-0e453672ef84', 'Ankara & Co Style Workshop', 'ankara-and-co-style-workshop-329', 'Join us for Ankara & Co Style Workshop in Ibadan.', now() + interval '59 days', 'Abuja, Nigeria', 74, 2000, 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/events.jpg'),
  ('1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Aso-Oke Atelier New Collection Launch', 'aso-oke-atelier-new-collection-launch-687', 'Join us for Aso-Oke Atelier New Collection Launch in Lagos.', now() + interval '19 days', 'Onitsha, Nigeria', 84, 0, 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/events.jpg'),
  ('722c7935-6528-4448-84e6-71c0e136fb09', 'Bead & Gold New Collection Launch', 'bead-and-gold-new-collection-launch-129', 'Join us for Bead & Gold New Collection Launch in Warri.', now() + interval '16 days', 'Kano, Nigeria', 119, 2000, 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/events.jpg');

-- ============================================================
-- news
-- ============================================================
insert into public.news (brand_id, title, slug, content, description, author, display_image) values
  ('74da33e5-0d2d-40e1-abe1-cad84f18f029', '916 Apparel opens applications for design internships', '916-apparel-opens-applications-for-design-internships-106', '916 Apparel shared an update with customers today about their latest work.', 'Update from 916 Apparel', '916 Apparel Team', 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/news.jpg'),
  ('661b88b3-51bd-41fc-b737-0e453672ef84', 'Ankara & Co shares behind-the-scenes look at production', 'ankara-and-co-shares-behind-the-scenes-look-at-production-679', 'Ankara & Co shared an update with customers today about their latest work.', 'Update from Ankara & Co', 'Ankara & Co Team', 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/news.jpg'),
  ('16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Naija Drip launches new season line', 'naija-drip-launches-new-season-line-245', 'Naija Drip shared an update with customers today about their latest work.', 'Update from Naija Drip', 'Naija Drip Team', 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/news.jpg'),
  ('bfa329ee-bce2-4e3f-a4c7-810674e1ace9', 'Adire House launches new season line', 'adire-house-launches-new-season-line-864', 'Adire House shared an update with customers today about their latest work.', 'Update from Adire House', 'Adire House Team', 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/news.jpg'),
  ('38826031-aedf-43a7-856a-d0414fbd7d23', 'Executive Cuts shares behind-the-scenes look at production', 'executive-cuts-shares-behind-the-scenes-look-at-production-485', 'Executive Cuts shared an update with customers today about their latest work.', 'Update from Executive Cuts', 'Executive Cuts Team', 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/news.jpg'),
  ('16212d7b-629e-45dc-a5ac-c9eb86e74425', 'Naija Drip celebrates 5 years in business', 'naija-drip-celebrates-5-years-in-business-449', 'Naija Drip shared an update with customers today about their latest work.', 'Update from Naija Drip', 'Naija Drip Team', 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/news.jpg'),
  ('661b88b3-51bd-41fc-b737-0e453672ef84', 'Ankara & Co opens applications for design internships', 'ankara-and-co-opens-applications-for-design-internships-419', 'Ankara & Co shared an update with customers today about their latest work.', 'Update from Ankara & Co', 'Ankara & Co Team', 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/news.jpg'),
  ('74da33e5-0d2d-40e1-abe1-cad84f18f029', '916 Apparel partners with local artisans on new capsule', '916-apparel-partners-with-local-artisans-on-new-capsule-710', '916 Apparel shared an update with customers today about their latest work.', 'Update from 916 Apparel', '916 Apparel Team', 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/news.jpg'),
  ('1a26ae0d-027e-407d-86c1-2bf654a5ea10', 'Aso-Oke Atelier launches new season line', 'aso-oke-atelier-launches-new-season-line-259', 'Aso-Oke Atelier shared an update with customers today about their latest work.', 'Update from Aso-Oke Atelier', 'Aso-Oke Atelier Team', 'http://127.0.0.1:54321/storage/v1/object/public/Local%20development/Home/news.jpg');

-- ============================================================
-- chats (AI feature). created_at is UNIQUE on this table, so each
-- row needs a distinct, explicit timestamp rather than a shared
-- default now(). messages is jsonb[] - one element per message.
-- ============================================================
insert into public.chats (user_id, title, messages, created_at) values
  ('34e8f5e6-5e0b-4187-8361-a022d3eea84c', 'Styling help', ARRAY['{"role": "user", "content": "What would go well with a navy blazer?"}'::jsonb, '{"role": "assistant", "content": "A crisp white shirt and slim charcoal trousers would pair well with a navy blazer."}'::jsonb], now() - interval '0 minutes'),
  ('e9aa9dfc-2d4a-4c8d-9135-32d97ba04421', 'Styling help', ARRAY['{"role": "user", "content": "What would go well with a navy blazer?"}'::jsonb, '{"role": "assistant", "content": "A crisp white shirt and slim charcoal trousers would pair well with a navy blazer."}'::jsonb], now() - interval '1 minutes'),
  ('191489c5-2380-4059-9f6f-c87df22d3ee6', 'Styling help', ARRAY['{"role": "user", "content": "What would go well with a navy blazer?"}'::jsonb, '{"role": "assistant", "content": "A crisp white shirt and slim charcoal trousers would pair well with a navy blazer."}'::jsonb], now() - interval '2 minutes'),
  ('9733860e-d677-4d54-a9ff-eca68b281c86', 'Styling help', ARRAY['{"role": "user", "content": "What would go well with a navy blazer?"}'::jsonb, '{"role": "assistant", "content": "A crisp white shirt and slim charcoal trousers would pair well with a navy blazer."}'::jsonb], now() - interval '3 minutes'),
  ('c7b3e855-3908-425f-9226-551ef3c308cc', 'Styling help', ARRAY['{"role": "user", "content": "What would go well with a navy blazer?"}'::jsonb, '{"role": "assistant", "content": "A crisp white shirt and slim charcoal trousers would pair well with a navy blazer."}'::jsonb], now() - interval '4 minutes'),
  ('e4c25901-1b9c-460d-99b7-56fb9beddabc', 'Styling help', ARRAY['{"role": "user", "content": "What would go well with a navy blazer?"}'::jsonb, '{"role": "assistant", "content": "A crisp white shirt and slim charcoal trousers would pair well with a navy blazer."}'::jsonb], now() - interval '5 minutes'),
  ('36be77a9-f2b8-4003-8b3a-89bd890b877b', 'Styling help', ARRAY['{"role": "user", "content": "What would go well with a navy blazer?"}'::jsonb, '{"role": "assistant", "content": "A crisp white shirt and slim charcoal trousers would pair well with a navy blazer."}'::jsonb], now() - interval '6 minutes'),
  ('9a21bf13-0d2d-43f5-a717-7bbd00d9f5ee', 'Styling help', ARRAY['{"role": "user", "content": "What would go well with a navy blazer?"}'::jsonb, '{"role": "assistant", "content": "A crisp white shirt and slim charcoal trousers would pair well with a navy blazer."}'::jsonb], now() - interval '7 minutes');