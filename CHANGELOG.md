# Changelog

All notable changes to this project will be documented in this file. See [conventional commits](https://www.conventionalcommits.org/) for commit guidelines.

---
## [unreleased]

### Bug Fixes

- **(bug)** fee management backend - ([1547e62](https://github.com/i-christian/school_management_system/commit/1547e628f7b29876eaa1402a3b5231f583394b9e)) - christian

### Documentation

- improve `deployment.md` - ([9b8ae3b](https://github.com/i-christian/school_management_system/commit/9b8ae3ba4001b33ebc6632170a30a306d33d68bc)) - christian
- add a link to `deployment.md` in `README.md` - ([3e02d62](https://github.com/i-christian/school_management_system/commit/3e02d62c207f278bb1d5ed49dcbecf8a96c2a49b)) - christian
- fix typo in README.md - ([4381f02](https://github.com/i-christian/school_management_system/commit/4381f0284e1e34c57bed2b885314cb3bbe6de2c6)) - christian
- fix `caddy docs` link in deployment.md - ([9a70d8d](https://github.com/i-christian/school_management_system/commit/9a70d8dc0c6adace252123affda39bb7e9cc5653)) - christian
- fix `CHANGELOG.md` github url - ([37be964](https://github.com/i-christian/school_management_system/commit/37be964827823a60d3f2348d90cd57e74acebd26)) - christian

### Features

- improve `CreateFeesRecord` to handle transfer of arrears from one term to another - ([4cd58a8](https://github.com/i-christian/school_management_system/commit/4cd58a8f56e1529d91bb0f4836440daa61dbd847)) - christian
- improve fees arrears handling - ([2f67390](https://github.com/i-christian/school_management_system/commit/2f673904207500504e6edee2a97100355731966c)) - christian

### Miscellaneous Chores

- add CHANGELOG.md - ([a71791b](https://github.com/i-christian/school_management_system/commit/a71791b2c39198b202aa6284f0913008d6b2f34a)) - christian
- improve `CHANGELOG.md` to use ` cocogitto's format`. - ([fe57e68](https://github.com/i-christian/school_management_system/commit/fe57e685aad68df8bc2391f1cd64fddb6577af7b)) - christian

### Refactoring

- improve `userProfile` handler method error handling - ([131d123](https://github.com/i-christian/school_management_system/commit/131d12382bb2bd8988a8af92a2787db660cc5513)) - christian

### Tests

- **(integration)** add test to validate academic year creation - ([9dceb4b](https://github.com/i-christian/school_management_system/commit/9dceb4b33a26cfa7ba8d3645a9f1aedee8e48990)) - christian
- **(integration)** add toggle active academic year endpoint test - ([4471559](https://github.com/i-christian/school_management_system/commit/4471559d778a6a847d7c20a988464e697761cc7e)) - christian
- **(integration)** add create new academic term test function - ([0038396](https://github.com/i-christian/school_management_system/commit/00383961f0811644538b21ab671e7971409b3e60)) - christian
- **(integration)** add toggle active term test - ([1dc6285](https://github.com/i-christian/school_management_system/commit/1dc6285a3cfc08e303d0a125e5c250fb6d278760)) - christian
- **(integration)** add test for `/dashboard/academics` endpoint - ([794e502](https://github.com/i-christian/school_management_system/commit/794e5021003cc10bde550d41492019c83c78548a)) - christian
- **(integration)** refactor dashboard tests - ([813b5d6](https://github.com/i-christian/school_management_system/commit/813b5d617f2a171ff5671ebbb0f8c183b55fbaad)) - christian
- **(integration)** refactor user's test - ([13c2222](https://github.com/i-christian/school_management_system/commit/13c2222a3d1b57826ff9d2a64c37d2b3ec457ba6)) - christian
- add tests to verify all routes permissions - ([7c5f2b6](https://github.com/i-christian/school_management_system/commit/7c5f2b61465a3dab1a2e8d762405e05689bbca29)) - christian
- fix `TestRoutes/Homepage_POST_(method_not_allowed)` to expect 405 error not 404 error. - ([8287570](https://github.com/i-christian/school_management_system/commit/82875701e01ac2925fe0f6fd4b1da426c1b6b4af)) - christian
- create a `LoginHelper` function to be used for integration tests - ([529b5c8](https://github.com/i-christian/school_management_system/commit/529b5c85e038ac370143e9e4f1fb4c4aa3c1996c)) - christian
- add a test for `/profile` endpoint - ([01c1108](https://github.com/i-christian/school_management_system/commit/01c1108597d904fd2c926a3335a3654b5e0cf161)) - christian
- add `logout` endpoint test - ([7fceaa7](https://github.com/i-christian/school_management_system/commit/7fceaa738f93ff80399b6291d2fd76776333ca2d)) - christian
- add admin dashboard tests - ([3a45124](https://github.com/i-christian/school_management_system/commit/3a45124694eea0b19cd5314affb805d318a268a0)) - christian
- add integration tests for `/dashboard/userlist` &`/dashboard/calendar` endpoints - ([c7ef49f](https://github.com/i-christian/school_management_system/commit/c7ef49f4957d85bfc296366c850d2ab2bcde7fbe)) - christian

### UI

- **(subjects list)** add details/summary format to subjects list per class. - ([183c2bd](https://github.com/i-christian/school_management_system/commit/183c2bdad643b1c54090212b20eac2880e838799)) - christian
- improve the fees management page - ([51d2191](https://github.com/i-christian/school_management_system/commit/51d2191337d931cc98545f537cf3f765e8f77ab9)) - christian
- improve student promotions page to only show promote students section if promotion rules are defined - ([0569ccd](https://github.com/i-christian/school_management_system/commit/0569ccd1e82fb37726f1efc30df73d93becb7491)) - christian
- improve permission for fee management - ([fd1eec5](https://github.com/i-christian/school_management_system/commit/fd1eec5e16b4beecdf556033414562cdcbe6b060)) - christian

---
## [0.1.0-alpha] - 2025-03-14

### Bug Fixes

- **(CI)** remove `promotion.sql.go` file to remove a redundant function - ([78abd6a](https://github.com/i-christian/school_management_system/commit/78abd6a21f288ea6fc3dcd9aa9027db95ec4e020)) - christian
- **(change password)** separate change password from other user fields. - ([d17d52e](https://github.com/i-christian/school_management_system/commit/d17d52ea54f576594b95e7ab086884f7976c423f)) - christian
- **(database)** remove unnecessary index - ([5d9e3ea](https://github.com/i-christian/school_management_system/commit/5d9e3eaf929e5e14b0136aebd67a5ceead437051)) - christian
- **(db)** enable btree_gist for UUID support in exclusion constraint - ([d09b6ed](https://github.com/i-christian/school_management_system/commit/d09b6edff01660969f7d0105945a163eaa151260)) - christian
- **(db)** ensure only one active academic year per update - ([da50fd6](https://github.com/i-christian/school_management_system/commit/da50fd6269dda26d027c75f9c0092783ad3f9681)) - christian
- **(db)** add unique constraints for remarks and discipline_records - ([821b866](https://github.com/i-christian/school_management_system/commit/821b866877543eb05fb63a8540d5046e0a9922b7)) - christian
- **(deploy)** add .env creation step to resolve missing file error - ([a07273e](https://github.com/i-christian/school_management_system/commit/a07273e9938ffe8582e20eafa0232c389ae36092)) - christian
- **(discipline)** enable student selection in search results - ([3b47fa5](https://github.com/i-christian/school_management_system/commit/3b47fa5f048c05a9db4a6f1abfa38ba450a8bdcc)) - christian
- **(edit user)** include password hashing in `EditUser` handler method - ([68dfa6a](https://github.com/i-christian/school_management_system/commit/68dfa6a2eb3a21b7b4af200f78dfa4b10d005336)) - christian
- **(fees)** update fee query to include fee structure data for students without fee records - ([34c7a10](https://github.com/i-christian/school_management_system/commit/34c7a10942876ebdfd0ebbc3431934d56b803f0b)) - christian
- **(trigger)** update fn_update_fee_status to fetch required amount from fee_structure - ([7f848b6](https://github.com/i-christian/school_management_system/commit/7f848b6fab2470ae76e1f7c52ea9ac9a0568c4f7)) - christian
- update Makefile to remove integration testing - ([1b609f7](https://github.com/i-christian/school_management_system/commit/1b609f7531225ac7a493bf570cf37c959d09b15f)) - christian
- add a missing semicolon to the end of an sql statement - ([42366c3](https://github.com/i-christian/school_management_system/commit/42366c397c62ef7aa69ed47d348300bdd39d97c7)) - christian
- a loginhandler bug which was causing the login handler to return 500 if a user_id and session_id are already present in the database - ([43514fd](https://github.com/i-christian/school_management_system/commit/43514fddf7110b4c379c64d3e7389e59a263dd5b)) - christian
- update logout functionality to redirect to homepage after logout - ([3ca6d4c](https://github.com/i-christian/school_management_system/commit/3ca6d4c7e610f78b4aeb76eb0d61c0e51be1a36f)) - christian
- update authmiddleware to set cookie expiry to two weeks - ([62b119d](https://github.com/i-christian/school_management_system/commit/62b119de66a69161f43d03e53fc0172b34738174)) - christian
- update GetUserDetails endpoint - ([12f9f6d](https://github.com/i-christian/school_management_system/commit/12f9f6d2462f141267fc90ecc0e5f2bcb9b9639f)) - christian
- change the query condition to use academic year name instead of id in ListAcademicYear table - ([82d1d65](https://github.com/i-christian/school_management_system/commit/82d1d6538958a723f3fd7068174a05fea23c1b9f)) - christian
- modify `CreateAssignment` handler method to return correct error messages - ([e1d7cb1](https://github.com/i-christian/school_management_system/commit/e1d7cb1ae9d880e9116b5d660e2d7337b3ec56e4)) - christian
- add wrong password error message on login form to give user feedback. - ([393a99e](https://github.com/i-christian/school_management_system/commit/393a99e759769633ce93d3e397b65584cab37b94)) - christian
- send 403 user forbidden error instead of 401 unauthorised - ([da5d97c](https://github.com/i-christian/school_management_system/commit/da5d97c2142bd0c0f1078129e247ed0224c1b734)) - christian
- update login handler to accept phone number or username as identifier - ([8fbaf2d](https://github.com/i-christian/school_management_system/commit/8fbaf2d246cfcb8a9857278cfbb78a56da03a0af)) - christian
- set ENV to `development` in test setup - ([164608f](https://github.com/i-christian/school_management_system/commit/164608fd6e5e2a6aa4058bb480f1bea0614ad969)) - christian
- add missing `users/create` endpoint - ([9b53da8](https://github.com/i-christian/school_management_system/commit/9b53da8b154e802bd487e2a8eca7d1c0f2992eaa)) - christian
- add current academic term to the student report card - ([2f45daf](https://github.com/i-christian/school_management_system/commit/2f45dafbc46b9f5fec4c99cb9df6ac8ea2997b71)) - christian
- add `PORT` variable to deploy workflow - ([30557f0](https://github.com/i-christian/school_management_system/commit/30557f0e8995da21119a6848405ea3b0c55ee0a3)) - christian

### CI

- **(testing)** re-run templ install and generate in test job to ensure generated files are available - ([3556555](https://github.com/i-christian/school_management_system/commit/35565559b0892ef6e07fb3b36f512cee3efbe907)) - christian
- update workflow to include code linting - ([a02bcbd](https://github.com/i-christian/school_management_system/commit/a02bcbdbc5ebaa5d21b9117abf8ac8667997af98)) - christian
- update testing workflow - ([9099066](https://github.com/i-christian/school_management_system/commit/9099066dd8ebf542da406190d2f5c83aab56b8ac)) - christian

### Documentation

- **(server)** Add documentation to grade handlers and helper functions - ([2f00057](https://github.com/i-christian/school_management_system/commit/2f00057b819fbf85a802e985baa269524a0f4afe)) - christian
- add database schema documentation - ([1d4902b](https://github.com/i-christian/school_management_system/commit/1d4902bc67122e72e6831b2badfba49a93e062c8)) - christian
- add comprehensive README.md - ([6025102](https://github.com/i-christian/school_management_system/commit/60251021dee120a0817e639dd97b2963ac266f09)) - christian
- add contributions section - ([12cf27c](https://github.com/i-christian/school_management_system/commit/12cf27c2d45ee11b2c0548ab91aba607a61c971b)) - christian
- update `deployment.md` to include missing secrets - ([0edebf6](https://github.com/i-christian/school_management_system/commit/0edebf667fa98d8ad19ae0dce5b0b0fad5b2977d)) - christian
- update deployment.md to include PORT variable - ([bf36fcb](https://github.com/i-christian/school_management_system/commit/bf36fcb36b37050948a9110c69cc9fd79155932f)) - christian

### Feat

- Implement Fees Record Creation and Improved Data Retrieval - ([f333ca6](https://github.com/i-christian/school_management_system/commit/f333ca6620d466010be51e7367b1ae6ddfe6fc5e)) - christian

### Features

- **(Home UI)** prevent login component swap on homepage login button when not authenticated - ([1725efd](https://github.com/i-christian/school_management_system/commit/1725efd877594650a5898f956e8eaa530cd29a39)) - christian
- **(UI)** improve the register user UI - ([a30fe52](https://github.com/i-christian/school_management_system/commit/a30fe5204601d7c2b6a0b912693e7fa39cc1532e)) - christian
- **(UI)** improve create user to redirect back to userlist after successful creation - ([ced9b50](https://github.com/i-christian/school_management_system/commit/ced9b506f0d06d7698a10f09526ee7d576c5c03c)) - christian
- **(UI)** Refactor dashboard component - ([29c3385](https://github.com/i-christian/school_management_system/commit/29c3385fd981d774d739c78802b023a50cca912b)) - christian
- **(UI)** implement `create` academic year modal - ([d4998d4](https://github.com/i-christian/school_management_system/commit/d4998d4bc02fdb774729662b373a409b93556f73)) - christian
- **(UI)** implement `EditYearModal` form - ([896074a](https://github.com/i-christian/school_management_system/commit/896074aa0d0ba58afbc753b0609188b85598975f)) - christian
- **(UI)** implement `EditTerm` functionality - ([6d0e812](https://github.com/i-christian/school_management_system/commit/6d0e812440a801e4f449420843017f046deefd2a)) - christian
- **(UI)** Enhance grades page styling for better readability and UX - ([24a9224](https://github.com/i-christian/school_management_system/commit/24a92245ac4195708d545f0f94d79d941e19492a)) - christian
- **(assigned-classes)** add expandable details/summary view for assigned classes list - ([699ac67](https://github.com/i-christian/school_management_system/commit/699ac67a25a3ff19b8698cf5c3bd65b5377c6322)) - christian
- **(assignments)** Implement create and list assignments - ([7c458ca](https://github.com/i-christian/school_management_system/commit/7c458cab51768350c5c1c912686a7727dea73039)) - christian
- **(auth)** add user_id to context alongside session_id - ([c31a79e](https://github.com/i-christian/school_management_system/commit/c31a79e16e3fb1c48100ebc8e5fc9b1645fe49fa)) - christian
- **(auth)** implement generic role-check middleware and optimize user loading - ([066f83d](https://github.com/i-christian/school_management_system/commit/066f83dd4184cdfc22714541e6da8700f843d7cb)) - christian
- **(calendar)** remove CDN modules and update to local assets - ([6675117](https://github.com/i-christian/school_management_system/commit/667511785d0decda09d4a3b413cfc3f777652c79)) - christian
- **(dashboard)** update DashboardCards styling and role-based rendering - ([53c92d8](https://github.com/i-christian/school_management_system/commit/53c92d82a30da7182d0cb7815868826a942fca71)) - christian
- **(dashboard)** add teacher's assigned classes card to DashboardCards - ([33d8b3a](https://github.com/i-christian/school_management_system/commit/33d8b3a79f77247f0bd1c44187f1eb85d0660b4d)) - christian
- **(dashboard)** Move calendar to dedicated page and add placeholder card - ([46ad8af](https://github.com/i-christian/school_management_system/commit/46ad8af6ce5f38b2b2dd3ec4bf97457744326440)) - christian
- **(database)** add calculated 'status' column to fees table - ([26fe5a9](https://github.com/i-christian/school_management_system/commit/26fe5a92ed08ef580dbdb3ba633ac773a30237ec)) - christian
- **(database)** implement CRUD operations on student_guardians table - ([2541596](https://github.com/i-christian/school_management_system/commit/2541596bd44eb2552a2a51d9c6b37bd439ab058f)) - christian
- **(database)** implement CRUD operations for fees table - ([ab30c8f](https://github.com/i-christian/school_management_system/commit/ab30c8f67314cee7d81f58b409d91d658ae1807f)) - christian
- **(database)** add remarks CRUD operations. - ([85de439](https://github.com/i-christian/school_management_system/commit/85de439274f419d54c6129a15af38b6f1b29b5be)) - christian
- **(database)** implement CRUD operations for discipline_records table - ([fb3103e](https://github.com/i-christian/school_management_system/commit/fb3103ed160af6ec7119ff41226d3aceda6dbba6)) - christian
- **(database)** add sql statement to retrieve all terms in a given academic year. - ([e7baf8b](https://github.com/i-christian/school_management_system/commit/e7baf8b88c5d88af7b63a3b2b4bd213d4c5c5d50)) - christian
- **(db)** add queries for fetching student details and lists - ([73f9886](https://github.com/i-christian/school_management_system/commit/73f98864cadd240f0c545ee72c846ae936cb7c86)) - christian
- **(db)** add upsert queries for remarks and discipline_records - ([64d81fd](https://github.com/i-christian/school_management_system/commit/64d81fd22db70cf7552dd4bd165578af1c3b0e7e)) - christian
- **(dto)** Structure grades data with new Grade and GradesMap types - ([f9f338b](https://github.com/i-christian/school_management_system/commit/f9f338b6c6a8c503bc4a8fcf3b8a8bc2184ddbb4)) - christian
- **(fees)** Implement edit fees record - ([d799852](https://github.com/i-christian/school_management_system/commit/d799852d0d600765d8fe943c30001c8996706264)) - christian
- **(gapless-numbering)** replace sequence-based solution with transactional counter - ([757af7c](https://github.com/i-christian/school_management_system/commit/757af7c0fb6d9166628def6e073f0187a6980078)) - christian
- **(grades)** Implement student grades listing functionality - ([75d69a3](https://github.com/i-christian/school_management_system/commit/75d69a340319202b7afa92004f549bc31da82296)) - christian
- **(grades)** implement `ListGrades` handler method - ([5b78229](https://github.com/i-christian/school_management_system/commit/5b7822918433f46b6ab71f880e9d31b40240e7bd)) - christian
- **(grades)** add class navigation with dynamic form loading - ([a1c3d4a](https://github.com/i-christian/school_management_system/commit/a1c3d4ac288877a05c2cb1939fff992fb9cb822a)) - christian
- **(grades-form)** Prepopulate grade inputs and add component documentation - ([3ce5a95](https://github.com/i-christian/school_management_system/commit/3ce5a9576aa163b95e1426c9e11e24432822ecae)) - christian
- **(nav)** update dashboard icon to chart SVG - ([ab63a04](https://github.com/i-christian/school_management_system/commit/ab63a04d194239e945bfcbae271bc9334cd6203a)) - christian
- **(nav)** add class icon for classes and subjects - ([1cf68c5](https://github.com/i-christian/school_management_system/commit/1cf68c53f37b7a968ebd3d3e59ef3b54df85c6b8)) - christian
- **(nav)** add student promotions section and fix tooltip titles - ([c995b05](https://github.com/i-christian/school_management_system/commit/c995b054656bd00c89379abefd7ca3bcd9808abb)) - christian
- **(nav)** add students report cards link - ([cccffc7](https://github.com/i-christian/school_management_system/commit/cccffc7f5d3b42087bd3ca49e3e17d6e610be35d)) - christian
- **(nav)** update "My Classes" icon - ([e8d1a7a](https://github.com/i-christian/school_management_system/commit/e8d1a7a6b42527d6ba5322e41a70717fe4613fad)) - christian
- **(remarks)** group remarks data by class and update templ component - ([f5dd73e](https://github.com/i-christian/school_management_system/commit/f5dd73e3ca30300ab29fef2798875e24517d75db)) - christian
- **(routes)** Improve route structure and role-based access - ([45d3d04](https://github.com/i-christian/school_management_system/commit/45d3d04ebb1ed08f67fb7601f39b13b8c4ef4889)) - christian
- **(schema)** prevent date overlaps and enforce single active academic year and term - ([030a6fd](https://github.com/i-christian/school_management_system/commit/030a6fdc42b3d5d7a2ec3314edfc2c6f4d35a9bc)) - christian
- **(students)** add student list page template - ([c1612f9](https://github.com/i-christian/school_management_system/commit/c1612f9197a1c79c45ad93b8f65d45d95ae1b8fb)) - christian
- **(students)** implement edit and delete user templ components - ([be6a67b](https://github.com/i-christian/school_management_system/commit/be6a67b4322c987639ad9c7625f974ff45989014)) - christian
- **(ui)** improve styling for remarks and discipline pages - ([3b11de3](https://github.com/i-christian/school_management_system/commit/3b11de39c5cac070be745fba9ee7f12c0b9c9ea1)) - christian
- **(users)** implement dynamic edit and delete modals with error handling - ([d24c7be](https://github.com/i-christian/school_management_system/commit/d24c7bef735f6ea26e06406bf1be4e324da08ae5)) - christian
- initial project setup - ([3dc1d30](https://github.com/i-christian/school_management_system/commit/3dc1d309bd9bc9ae51e5d1bc8b327397db51aae9)) - christian
- implement an insert statement to create a new user - ([6633203](https://github.com/i-christian/school_management_system/commit/663320342c5a6c8c574eb822738db971d28adaf9)) - christian
- implement all CRUD operations on users table - ([4032954](https://github.com/i-christian/school_management_system/commit/40329545d0dbd923fd26b78d9c7701f3df4459d4)) - christian
- add sessions CRUD operations - ([9e8e199](https://github.com/i-christian/school_management_system/commit/9e8e1992d93ac318755ab18632ed14dd2c8e0347)) - christian
- implement academic year and terms CRUD operations - ([9ca4dc5](https://github.com/i-christian/school_management_system/commit/9ca4dc508b124b25671fe522fef1995a51d3b2df)) - christian
- add classes and subjects CRUD operations - ([8b0ba8f](https://github.com/i-christian/school_management_system/commit/8b0ba8fa35b6ad8ddfdcc0a8436fa2306eb48691)) - christian
- implement teacher assignments CRUD operations - ([2b533e9](https://github.com/i-christian/school_management_system/commit/2b533e9b1c333b8b5587eebbb3e27d056d821270)) - christian
- implement students CRUD operations - ([1b08233](https://github.com/i-christian/school_management_system/commit/1b0823355cfd08f606e0cb516ffb0bb8bc9dee2d)) - christian
- implement guardians CRUD operations queries - ([29ee34c](https://github.com/i-christian/school_management_system/commit/29ee34cde300527a604fe205bbbe27b869311771)) - christian
- implement `student_classes` CRUD operations - ([f1b1682](https://github.com/i-christian/school_management_system/commit/f1b1682c2f28fb36e950c478b175b3a176be69ae)) - christian
- implement grades CRUD operations - ([c93998b](https://github.com/i-christian/school_management_system/commit/c93998b9839f55daf6e44e98885735250af61f1b)) - christian
- improve students management schemas - ([245fd24](https://github.com/i-christian/school_management_system/commit/245fd2498b6d14b41ed4548c2d313f2b2797b196)) - christian
- implement session management for the application - ([46fa237](https://github.com/i-christian/school_management_system/commit/46fa2377006b21a9b447e33207731ac71ccb272c)) - christian
- implement user registration endpoint - ([0d46ac8](https://github.com/i-christian/school_management_system/commit/0d46ac841b9c45d1ed56160e31ba2caf070c9190)) - christian
- Add password visibility toggle for registration form - ([4dab864](https://github.com/i-christian/school_management_system/commit/4dab8641beb30e7c0a44ef4b00ab88fc8ad86a53)) - christian
- implement login UI form - ([cddaefc](https://github.com/i-christian/school_management_system/commit/cddaefc168890ebbbb50c18a714b110a17bc0c34)) - christian
- create sidebar with user section, settings, and logout functionality - ([9ba6cf7](https://github.com/i-christian/school_management_system/commit/9ba6cf7d3d65e228bf76da745ce265b6fc4ed86d)) - christian
- center login form and improve error handling UI - ([1e62442](https://github.com/i-christian/school_management_system/commit/1e62442e01282c456d4ae9c0ef9828bbeda426a9)) - christian
- add a landing page route - ([6e8245c](https://github.com/i-christian/school_management_system/commit/6e8245cd5146716c3ba817c2892f3ef07271e1d7)) - christian
- Create homepage layout with sections for About, Achievements, and Contact - ([bcb5a88](https://github.com/i-christian/school_management_system/commit/bcb5a887c6bb106acfd117177f9ea0b77b20303e)) - christian
- add an href to homepage login button - ([6765040](https://github.com/i-christian/school_management_system/commit/6765040839ab1a22af53e2b465e2b33a94b7feeb)) - christian
- add Docker Compose file to manage app, database, Caddy reverse proxy, and Adminer for database management - ([8366f12](https://github.com/i-christian/school_management_system/commit/8366f12ac3f88b19621a765ceeb231971d46d156)) - christian
- improved docker-compose.yml - ([ef61baa](https://github.com/i-christian/school_management_system/commit/ef61baa8d576d82b5b20e5399f8346499c9d1b3d)) - christian
- implement session management for the application - ([6b9b0b4](https://github.com/i-christian/school_management_system/commit/6b9b0b44dc174e984454d3350f8afe2cdb5709b6)) - christian
- add middleware to redirect authenticated users from login pages - ([6c2de63](https://github.com/i-christian/school_management_system/commit/6c2de63d51948bdb8bdcfd08e054eba4f0d895c3)) - christian
- implement login redirection to dashboard after successful login - ([20afade](https://github.com/i-christian/school_management_system/commit/20afadeb652d7a51663c075a9dd3e3c28f185bca)) - christian
- refactor AuthMiddleware - ([68486ca](https://github.com/i-christian/school_management_system/commit/68486caeae470692c44a3eefd1d55f0d74219537)) - christian
- create middleware.go - ([f00954a](https://github.com/i-christian/school_management_system/commit/f00954a82f6cc735fb58a70b2e7515b4f9f73dcb)) - christian
- create userDetails handler - ([91fc251](https://github.com/i-christian/school_management_system/commit/91fc251c0453d1b701fb763a45addaea74edc73b)) - christian
- add EditUser handler function - ([ff6b25f](https://github.com/i-christian/school_management_system/commit/ff6b25f515da1f3b32bfe1f118cd74ac40135bc2)) - christian
- implement a listUsers handler function - ([0a40baf](https://github.com/i-christian/school_management_system/commit/0a40baf25fbcc25adf4baba0b6c4952b4b8cb604)) - christian
- implement userRole handler - ([a10dbd5](https://github.com/i-christian/school_management_system/commit/a10dbd577eb0881025c70a571a80f5a9e1a851b1)) - christian
- create users.templ - ([0cd06c4](https://github.com/i-christian/school_management_system/commit/0cd06c48b9027c7d291c5b455d21690fb03c6c99)) - christian
- improve sidebar responsiveness, styling, and accessibility - ([eb9321e](https://github.com/i-christian/school_management_system/commit/eb9321e355f89c7723bfffa420eaf71f531cc507)) - christian
- add a link route to user register on create user button - ([b304e9a](https://github.com/i-christian/school_management_system/commit/b304e9ab260b9adf3d0a23e48f80feb1c33d4e31)) - christian
- implement delete user endpoint - ([76fdcfe](https://github.com/i-christian/school_management_system/commit/76fdcfe42d0cd498710dae87d7b704ce9195e6bd)) - christian
- implement CreateAcademicYear handler - ([fe5fc32](https://github.com/i-christian/school_management_system/commit/fe5fc32a1ee9b130bb70a4779809d44d0c45431a)) - christian
- implement edit academic year handler function - ([8b8296f](https://github.com/i-christian/school_management_system/commit/8b8296f07287341745015f245330da3ce1aaa76c)) - christian
- create CreateTerm handler method - ([1eba8f6](https://github.com/i-christian/school_management_system/commit/1eba8f65fb2d2bedd0de2a503709ccdf8bb7e1a9)) - christian
- implement delete academic year handler - ([f26a36a](https://github.com/i-christian/school_management_system/commit/f26a36a41f9af2aaf172ad97dc2b986a3299407c)) - christian
- implement ListTerms handler - ([365bbb4](https://github.com/i-christian/school_management_system/commit/365bbb4999762bb1923b8ea36253ad08ce2d9fea)) - christian
- implement GetTerm handler method - ([4dfee2c](https://github.com/i-christian/school_management_system/commit/4dfee2c74106683f527e6a837768f883e7a42cca)) - christian
- implement EditTerm handler method - ([dd2a32b](https://github.com/i-christian/school_management_system/commit/dd2a32bda0c926bb700e97099602548c0d35c9e5)) - christian
- implement `DeleteTerm` handler method - ([5c218b7](https://github.com/i-christian/school_management_system/commit/5c218b7d522591df7b56dc0612a1531f243aa324)) - christian
- implement `CreateClass` handler method - ([1f4897e](https://github.com/i-christian/school_management_system/commit/1f4897ef9e8dd8218905172ae4415c31ac56ab79)) - christian
- implement `ListClasses` handler method - ([70c368f](https://github.com/i-christian/school_management_system/commit/70c368f4c428d63c977594aa9fc08e701bb05e8a)) - christian
- implement editclass handler method - ([44ecd54](https://github.com/i-christian/school_management_system/commit/44ecd54da81fdc98941a7506749a5bcee1bd4f86)) - christian
- implement `deleteClass` handler method - ([59193f2](https://github.com/i-christian/school_management_system/commit/59193f267340f40b389e0cf88f61862f3495a1b9)) - christian
- implemet `CreateClass` method handler - ([54b1ca6](https://github.com/i-christian/school_management_system/commit/54b1ca6d08fc17b55e65a494128f122ff5eef436)) - christian
- implement `ListSubjects` handler method - ([3df15bf](https://github.com/i-christian/school_management_system/commit/3df15bfa777c43deca5910d6c510ee739c93d5e8)) - christian
- implement `EditSubject` handler method - ([364a01d](https://github.com/i-christian/school_management_system/commit/364a01d15f210d43c0c45cba6e6f44cdcf2ef12d)) - christian
- implement `DeleteSubject` handler method - ([7d1a6d1](https://github.com/i-christian/school_management_system/commit/7d1a6d12265c9e1535e446a7316097c3aac7d813)) - christian
- implement teacher to class assignment functionality - ([8e216cc](https://github.com/i-christian/school_management_system/commit/8e216cc39badabcafc793260ee587b8c7086a355)) - christian
- implement GetAssignment handler method - ([92713d2](https://github.com/i-christian/school_management_system/commit/92713d291c159329b4cf521e86c0eb7abe2dbf6a)) - christian
- implement `ListAssignments` handler method - ([578eee0](https://github.com/i-christian/school_management_system/commit/578eee0ca7192246664b5a26cc69fe5c5c6d2604)) - christian
- implement `EditAssignment` handler method - ([0ba7960](https://github.com/i-christian/school_management_system/commit/0ba79606b29bf9eca6e75678f9705161e5e78f8e)) - christian
- implement `DeleteAssignment` handler method - ([4acdbc3](https://github.com/i-christian/school_management_system/commit/4acdbc30d4abe118101ca2c1fe0bdecd612e9757)) - christian
- Implement and test "CreateStudent" query with student-guardian relationship - ([355d898](https://github.com/i-christian/school_management_system/commit/355d898f69db17640689b8d49e2d14a34005e428)) - christian
- create errors.go - ([79bb327](https://github.com/i-christian/school_management_system/commit/79bb3277ae0b0791f0b26ac1993fb59e6ff35fd0)) - christian
- Improve login form UI/UX with SVG password toggle, better accessibility, and mobile responsiveness - ([a205b9b](https://github.com/i-christian/school_management_system/commit/a205b9b497f6d81bdb179926bd3eaf671966c7df)) - christian
- implement `Create User` UI component - ([54f9af6](https://github.com/i-christian/school_management_system/commit/54f9af63b4bb582c7452f1156ffdf9a5f6090f87)) - christian
- implement Grid Layout for Dashboard Cards - ([951df92](https://github.com/i-christian/school_management_system/commit/951df92112674da786d0d9809a6398d035c8b7f4)) - christian
- refactor `GetUserDetails` handler method - ([e68a252](https://github.com/i-christian/school_management_system/commit/e68a2520c9220289b447151fca0797cc70acfd99)) - christian
- improve userDetails templ component to accept user data as json - ([f2f0882](https://github.com/i-christian/school_management_system/commit/f2f0882cd40d6b8d9d842e2e6dc4cf7dc376173c)) - christian
- implement secureHeaders middleware for enhanced HTTP security - ([a5e21ae](https://github.com/i-christian/school_management_system/commit/a5e21ae946a98bca4fd9876fae8c1024a871c1f9)) - christian
- add triggers to auto-generate user and student numbers - ([054adde](https://github.com/i-christian/school_management_system/commit/054addec9bd328b3e42281dd62dd9522d483ac84)) - christian
- Replace generated status column with trigger in fees table - ([e133e71](https://github.com/i-christian/school_management_system/commit/e133e7157c5b99c8ecb2dc8b2c13288907aac910)) - christian
- add insights queries for users, students, and fees - ([8b3d924](https://github.com/i-christian/school_management_system/commit/8b3d9249f4fc758e9d9517af0e263f5c8d85410e)) - christian
- implement `GetUserTotals` handler method - ([e0ce46f](https://github.com/i-christian/school_management_system/commit/e0ce46f4d2f0c09e0e2359c9f7e182bcb6b5c5b5)) - christian
- add dashboard insight handlers for students and fees - ([bc74e75](https://github.com/i-christian/school_management_system/commit/bc74e75a28abde15f723572ba32ec948e35db0ee)) - christian
- prevent duplicate superuser creation in createSuperUser function - ([db9ac69](https://github.com/i-christian/school_management_system/commit/db9ac693db20abbbcd3d513473a19eb2cab80b95)) - christian
- add no browser caching control for pages that require auth - ([33b8806](https://github.com/i-christian/school_management_system/commit/33b8806ed7fe9657808fb5942a7995b6b194ee92)) - christian
- Add environment-based configuration for Secure cookie flag - ([98c03c7](https://github.com/i-christian/school_management_system/commit/98c03c755125bdf0192b87fc522a30a243c75c2e)) - christian
- implement academic years & terms management with HTMX - ([189a065](https://github.com/i-christian/school_management_system/commit/189a0655ad42b635e20b633a1b97dbac71288867)) - christian
- implement `userlist` package - ([506af59](https://github.com/i-christian/school_management_system/commit/506af595546103627e84cd7e482d6e34411edb54)) - christian
- implement `create term` endpont - ([1633e81](https://github.com/i-christian/school_management_system/commit/1633e816a2492bef65ebd6208726d1be82901c4b)) - christian
- implement current academic year and term dashboard card - ([a83048a](https://github.com/i-christian/school_management_system/commit/a83048a507eca60866b2f47cdc00535d1931b576)) - christian
- improve academic year and terms UI - ([58db79a](https://github.com/i-christian/school_management_system/commit/58db79a4cbbed23a4dfa23c697c002fc5f9b6e66)) - christian
- implement toggle active year & term backend logic - ([546a9ab](https://github.com/i-christian/school_management_system/commit/546a9aba6abe61441912a8f3082ba91a80c666e6)) - christian
- track student promotions with class history - ([ecd4d56](https://github.com/i-christian/school_management_system/commit/ecd4d56c37d8fe273cc1e103624cbaee8a211492)) - christian
- add student creation form with guardian details - ([ae159b9](https://github.com/i-christian/school_management_system/commit/ae159b9f74d1da417605e0b7ea82f5cf73ca04ed)) - christian
- implement `Create Student` functionality - ([13dac86](https://github.com/i-christian/school_management_system/commit/13dac86adecfd12241a4dadddd3ede4abb792c47)) - christian
- implement `createStudentClass` function - ([ab44f6d](https://github.com/i-christian/school_management_system/commit/ab44f6d1ea35692ea0e14a83e691a872914f9dc2)) - christian
- implement edit student handler method - ([a62ce4f](https://github.com/i-christian/school_management_system/commit/a62ce4f8875dfcf7ea394bbc3ef9d56b24bcafa8)) - christian
- implement `DeleteStudent` endpoint - ([c630f1e](https://github.com/i-christian/school_management_system/commit/c630f1e353f8c847c1ac2791c7adbbcdede2ff05)) - christian
- create `guardians page` - ([e6323c3](https://github.com/i-christian/school_management_system/commit/e6323c38754407b173020c70c5d5c2b481943c7d)) - christian
- implement `getGuardianByID` query - ([7d814f6](https://github.com/i-christian/school_management_system/commit/7d814f6dcef33b45bbd6f681c83f52557ad06b0b)) - christian
- implement edit guardian form - ([0e29964](https://github.com/i-christian/school_management_system/commit/0e29964801d75c7498085a902b991fd9f1e5dd42)) - christian
- implement `EditGuardian` handler method - ([77105a8](https://github.com/i-christian/school_management_system/commit/77105a86e7dc51fc18648c26e67974e644298533)) - christian
- implement search guardians using student first and last name - ([d549bdf](https://github.com/i-christian/school_management_system/commit/d549bdfb6c59e150ef565ead78317a130e1d0b7d)) - christian
- implement `ListStudentSubjects` query - ([bad6e7e](https://github.com/i-christian/school_management_system/commit/bad6e7e564df9a10cbb177e326a08231cd0e40c0)) - christian
- implement enter grades form with student, subject, and term selection - ([b84ea50](https://github.com/i-christian/school_management_system/commit/b84ea50f27d420076097d53ba0b68040a79a7863)) - christian
- implement a virtual_classroom view - ([0a65c57](https://github.com/i-christian/school_management_system/commit/0a65c57859ca42e8c8054871d96b91b530685d75)) - christian
- Improve EnterGradesForm UI for bulk grade entry - ([77299f7](https://github.com/i-christian/school_management_system/commit/77299f7664ebab263888de64851f723280d4ba57)) - christian
- replace HTMX form submission with JavaScript JSON request - ([4ea4e01](https://github.com/i-christian/school_management_system/commit/4ea4e01b6b58ead57fddffb131e9411318685438)) - christian
- add transactional handling and enhanced error logging to SubmitGrades - ([75dcbbf](https://github.com/i-christian/school_management_system/commit/75dcbbfd56bf2284192f0aea47c9a194fcf3b08d)) - christian
- Add animated popover for grade submission feedback - ([c98ecf5](https://github.com/i-christian/school_management_system/commit/c98ecf5fe70254649fb421ad889a35e559d0258e)) - christian
- implement `remarks` page - ([ca8d720](https://github.com/i-christian/school_management_system/commit/ca8d72073a30fc3934c3ca22c9a9a9532affa119)) - christian
- disable submit button during submission with cursor-progress style - ([7c4c62a](https://github.com/i-christian/school_management_system/commit/7c4c62a98d74ff987df2e5c6d026698c042339dc)) - christian
- add disciplinary record form with live student search - ([718fb8f](https://github.com/i-christian/school_management_system/commit/718fb8ff5289345bfbf1b123205bf48cbfdbbe9e)) - christian
- add popover for success and error messages in remarks submission - ([a6abdc4](https://github.com/i-christian/school_management_system/commit/a6abdc425940da3551d670a41580ecabcc0a591b)) - christian
- Implement student report card PDF generation - ([f473ae2](https://github.com/i-christian/school_management_system/commit/f473ae256d54ac05c4f52946ccc4c6dadefe12ef)) - christian
- Implement student report card generation and download - ([04a326e](https://github.com/i-christian/school_management_system/commit/04a326ec6af0be574a31c426467b1a9fae47825f)) - christian
- Improve term and fee management logic, fix student promotions - ([aa5093e](https://github.com/i-christian/school_management_system/commit/aa5093e28bf3d2411b53515945512337e0b88c1c)) - christian
- enhance student promotion query to handle graduation and prevent duplicate promotions - ([61321b6](https://github.com/i-christian/school_management_system/commit/61321b687a04389780d98a3ba9fd80fea56e70f5)) - christian
- implement fee management UI and backend endpoints - ([ea379d7](https://github.com/i-christian/school_management_system/commit/ea379d765edb8faf819b8d93f5e3e332cfdfe8b8)) - christian
- implement fees structuring for a given class and term - ([ba00c87](https://github.com/i-christian/school_management_system/commit/ba00c87e73013fa5524b17fcc939011727e26670)) - christian
- Use Bookworm base images for smaller Debian-based image - ([d5bc65e](https://github.com/i-christian/school_management_system/commit/d5bc65e2417b68a31654edb513f41060419105d8)) - christian
- Implement term-based student promotion with academic year aware class updates - ([60e3b0c](https://github.com/i-christian/school_management_system/commit/60e3b0c404f5e0d60d541f86921a182f5a21dc3d)) - christian
- Implement Promotions Page UI with Templ - ([963bc33](https://github.com/i-christian/school_management_system/commit/963bc3329de3e58e137e13b6c53a743a85c8a1f6)) - christian
- implement graduates Page - ([76a9246](https://github.com/i-christian/school_management_system/commit/76a92463cbf41608cf19e6ba154207dd3a4070fc)) - christian
- implement `ShowGraduatesList` handler method - ([7a4bac4](https://github.com/i-christian/school_management_system/commit/7a4bac4402499a8387c63bc1a23b6020612df95a)) - christian
- implement student promotions page - ([a56b929](https://github.com/i-christian/school_management_system/commit/a56b92970cbf71d764a9225ada0689fd948d84f9)) - christian
- implement Create student promotions rules logic and validations - ([c4a7939](https://github.com/i-christian/school_management_system/commit/c4a7939b1b87f2b5b71fcc4f0aede01f6d499f5e)) - christian
- implement `resetPromotionRule` handler method and database query - ([a37b9fa](https://github.com/i-christian/school_management_system/commit/a37b9fadd4cd5f3bf127e939a02375358e7b34fb)) - christian
- implement `reset promotion rules` confirmation modal - ([07076ed](https://github.com/i-christian/school_management_system/commit/07076ed87b9c0e4fc04539970546680e34a23ed4)) - christian
- implement undo promotions functionality - ([442761b](https://github.com/i-christian/school_management_system/commit/442761b8a5abf9fbdfe4ec6e7afdbadb84feb280)) - christian
- implement and undo promotions form in student promotions page - ([f49d125](https://github.com/i-christian/school_management_system/commit/f49d125b5a4d4fce17e592d41b55a02861385b19)) - christian
- implement class promotion UI - ([1d90240](https://github.com/i-christian/school_management_system/commit/1d9024020332b5d9a6e9d7e5613a482684f63d1f)) - christian
- implement `PromoteStudents` handler method - ([98ce95d](https://github.com/i-christian/school_management_system/commit/98ce95d40cb0aac3f13f28f6b5b5000678a3d2e9)) - christian
- implement `ListStudentReportCards` sql query from a particular class - ([a22f88d](https://github.com/i-christian/school_management_system/commit/a22f88db39710c4f5bcd227f91349ae60f69d54a)) - christian
- improve `reports.templ` component to render based on presence of students grades or display a `not found banner` - ([a502ee0](https://github.com/i-christian/school_management_system/commit/a502ee0e082b7c3aa6d53fbab4193ccbcf1afc34)) - christian
- Render dynamic academic events on FullCalendar - ([1bed9d0](https://github.com/i-christian/school_management_system/commit/1bed9d0732ba004406f722868a74d267620d316c)) - christian
- implement export user list to pdf functionality - ([4bf2f2c](https://github.com/i-christian/school_management_system/commit/4bf2f2cfea54d051e0db98d4a0b808b0e0249328)) - christian
- implement `user settings page` - ([7d551c5](https://github.com/i-christian/school_management_system/commit/7d551c5d905955f80d849f87a884271e3f27a3ac)) - christian
- implement `ShowUserSettings` handler method - ([fba1170](https://github.com/i-christian/school_management_system/commit/fba1170b9e12371f5a38a1ffd804b1481c4d213d)) - christian
- implement `EditUserProfile` handler method - ([7346212](https://github.com/i-christian/school_management_system/commit/7346212486b0ac2c9fc0fc0d8f73681e7a38bbc1)) - christian
- enhance User Settings UX with section toggles and password visibility - ([860246c](https://github.com/i-christian/school_management_system/commit/860246c18178b01d668a7331734b3cd3e173dd5f)) - christian
- implement students list pdf download functionality - ([3b0e040](https://github.com/i-christian/school_management_system/commit/3b0e040c3cb10c4da9ed296d2d4facac1adc16da)) - christian
- add deploy.yml git action file - ([374522d](https://github.com/i-christian/school_management_system/commit/374522d8ecb2319e25f35942caae3731b4e39983)) - christian
- update production deployment workflow - ([2069bbc](https://github.com/i-christian/school_management_system/commit/2069bbc6e9e22f3869aa0f319c6b1fabeefeb9f0)) - christian

### Fix

- Retrieve user role using user_id instead of session_id - ([f86a86f](https://github.com/i-christian/school_management_system/commit/f86a86f7958d32faafbf6a1c16334ff5563c67b0)) - christian
- Correctly handle INSERT and UPDATE in fee status trigger - ([bc3dd2d](https://github.com/i-christian/school_management_system/commit/bc3dd2dfaffc4be9d3a1afb8ef8aa3afe4968880)) - christian
- Revert to default day number rendering in calendar - ([a6f1508](https://github.com/i-christian/school_management_system/commit/a6f1508cee942dacb968e286bd62cfa4ae440b01)) - christian

### Miscellaneous Chores

- **(Makefile)** remove docker commands - ([9c8ce9d](https://github.com/i-christian/school_management_system/commit/9c8ce9daeaf8efb4c317c14f2dad11b82598a4f9)) - christian
- **(docker)** add Dockerfile to containerize the application - ([0106ac6](https://github.com/i-christian/school_management_system/commit/0106ac6286c4334f560188740cc7b627188b207c)) - christian
- **(docker)** fix invalid yaml syntax for shell variable expansion - ([56ff2aa](https://github.com/i-christian/school_management_system/commit/56ff2aae4e7d2f38486f442f2ebd7109bee79cf2)) - christian
- **(tailwindcss)** upgrade to v4 - ([98b1c8e](https://github.com/i-christian/school_management_system/commit/98b1c8ee7e2436fa535018661002f670f8b48eb7)) - christian
- add a full database initial schema for the app - ([9f0d31c](https://github.com/i-christian/school_management_system/commit/9f0d31c541532bfe4249fe12118848ca58538c2f)) - christian
- add Caddyfile for reverse proxy configuration - ([0a708cd](https://github.com/i-christian/school_management_system/commit/0a708cd6fea5d06eb9fd2264f64f6f2a71dad2aa)) - christian
- change dependancies - ([d714036](https://github.com/i-christian/school_management_system/commit/d714036a86b1a8863d7baa4b986d33b0264a2ceb)) - christian
- update MakeFile to run application - ([21fa772](https://github.com/i-christian/school_management_system/commit/21fa772e5ce9b21edfa8ef4549568f2945043c9d)) - christian
- improve docker-compose.yml to support using docker secrets - ([cbf0e68](https://github.com/i-christian/school_management_system/commit/cbf0e6856f8161ff2d570f893f7a79583045efe9)) - christian
- Add docker compose up and down commands to Makefile - ([e58d2d2](https://github.com/i-christian/school_management_system/commit/e58d2d2ff7447837a6fce1cabbf9f8e790ba777d)) - christian
- setup integration testing - ([f836ef2](https://github.com/i-christian/school_management_system/commit/f836ef2617ea4afe3715213e4b167fa19034c0c1)) - christian
- add `tests` directory to .air.toml ignore list - ([67345cf](https://github.com/i-christian/school_management_system/commit/67345cfbddc3156030d0e2e4460e2c3bb8296107)) - christian
- upgrade golang from v1.23 to v1.24 - ([3f579d7](https://github.com/i-christian/school_management_system/commit/3f579d72e80c44a4c9b7cc084ec92e96e7c998a2)) - christian
- fix delete assignment route - ([ce15b7f](https://github.com/i-christian/school_management_system/commit/ce15b7f8fa6b5c0c0baeba0e14e18e794b9998cb)) - christian
- configure role based permissions on routes using middleware - ([9705447](https://github.com/i-christian/school_management_system/commit/97054477f50634fa112f09f2ba2df594f3a3794c)) - christian
- add `deployment.md` file - ([0a5e300](https://github.com/i-christian/school_management_system/commit/0a5e300ba4729b7a283466e2dc0aa6fcca87cd8a)) - christian
- add the missing `DB_USERNAME` to deploy workflow file - ([7f9cb96](https://github.com/i-christian/school_management_system/commit/7f9cb965085b41fe54caa8357e366a7b6d342f78)) - christian

### Refactor

- improve the `Add new fee` page - ([3e64563](https://github.com/i-christian/school_management_system/commit/3e645637ab0fe16028f9225908a099233754d5b3)) - christian

### Refactoring

- **(CreateStudent query)** split complex student creation query into modular operations - ([9d996dd](https://github.com/i-christian/school_management_system/commit/9d996dd023ce93324e265e4d0ffa673938cf8425)) - christian
- **(grades)** improve grade entry structure - ([802938f](https://github.com/i-christian/school_management_system/commit/802938f56bed3148f74905f7ca1db5deb572c480)) - christian
- **(guardian page)** remove the onload trigger event from active search bar - ([5e556db](https://github.com/i-christian/school_management_system/commit/5e556db56593548cb27e8e48c8463e28b67bf2c7)) - christian
- **(nav)** decouple user role for role-based rendering - ([3021307](https://github.com/i-christian/school_management_system/commit/3021307d7a7b0a757b784fe4aede929b6c12e153)) - christian
- **(sidebar)** update NavList component to use Tailwind CSS only - ([b31dde9](https://github.com/i-christian/school_management_system/commit/b31dde9ddc5a6bc6fe3f2f9964907a6ea64940db)) - christian
- add chi router library - ([d6db79a](https://github.com/i-christian/school_management_system/commit/d6db79aca8ac8a0cec2534a439a338a6f0d5cb10)) - christian
- Add join statements in assignments.sql to get better formated results from multiple tables - ([a9a0388](https://github.com/i-christian/school_management_system/commit/a9a0388876f7b4b614aca113acd750e910de80f0)) - christian
- improve remarks CRUD operations - ([08b61fa](https://github.com/i-christian/school_management_system/commit/08b61fac9a31737d61abf94a5ef7e4a7169ab7c6)) - christian
- improve student_classes querries - ([017b744](https://github.com/i-christian/school_management_system/commit/017b7442d400e9319178e03b18f0c59edc1b06f8)) - christian
- improve queries to fetch subjects (all subjects and by class name) - ([b91839f](https://github.com/i-christian/school_management_system/commit/b91839f00b9957972380f3525084fe82abef580a)) - christian
- remove all hardcoded values to instead use env vars. - ([f6aec4f](https://github.com/i-christian/school_management_system/commit/f6aec4fa5ca1d882e8935f0c27fbd961a6bff5b4)) - christian
- remove hardcoded project name and use an env variable instead - ([ac20379](https://github.com/i-christian/school_management_system/commit/ac203798c9beefa7c6e0df6eb07aa0d09a14245c)) - christian
- remove header section from base.templ - ([14b0b13](https://github.com/i-christian/school_management_system/commit/14b0b13371ef95d78cd5ed353f92668f66f29772)) - christian
- update deleteAssignment handler to return immediately after a database error - ([c09f841](https://github.com/i-christian/school_management_system/commit/c09f84112af4c93474647dc8c953eaffff99f214)) - christian
- overhaul dashboard layout and UI components - ([5f139fc](https://github.com/i-christian/school_management_system/commit/5f139fc9e3fede7236f775c92c110a5068aacc7b)) - christian
- enhance Home template layout and responsiveness - ([8c3772d](https://github.com/i-christian/school_management_system/commit/8c3772d08986cff4a14ed128802e62b04681665e)) - christian
- remove app.js - ([e974bd3](https://github.com/i-christian/school_management_system/commit/e974bd3d00b8543fbd28ea4e9536514a0e743e01)) - christian
- fix toggle password logic to display correct icons - ([6ff40ed](https://github.com/i-christian/school_management_system/commit/6ff40ed058a55aed3e6a2d58f9b52aec34d1bbf8)) - christian
- move UserProfile and NavList components from `dashboard.templ` to `profile.templ` and `navlist.templ` - ([adc1846](https://github.com/i-christian/school_management_system/commit/adc18465f8ed0aa2806c6c7826110df624ce3285)) - christian
- extract identifier lookup logic to reduce repetition in login handler - ([d71425d](https://github.com/i-christian/school_management_system/commit/d71425df7696b3f9de44488410b6642368eaa26c)) - christian
- replace inline SVG icons with FontAwesome and enhance UserProfile dropdown - ([fca4086](https://github.com/i-christian/school_management_system/commit/fca4086a78a7bd429f06b16b727cd7ebf0399d84)) - christian
- improve `CreateStudent` component - ([c70e878](https://github.com/i-christian/school_management_system/commit/c70e87889a179918d21e762cd846b85249264e78)) - christian
- fix active search functionality on guardians page - ([b60fc31](https://github.com/i-christian/school_management_system/commit/b60fc3107129ff710df9a7e9804bbd138388fee2)) - christian
- redesign enter grades form to use a table format - ([b1c5997](https://github.com/i-christian/school_management_system/commit/b1c5997cf0cfac48b68fd115822b30a90b03794e)) - christian
- Extract popover styling into a reusable global class - ([3fcb16b](https://github.com/i-christian/school_management_system/commit/3fcb16b8d3999fbbdff6d4cbe86c95430752899b)) - christian
- implement `createStudentReportPdf` helper function - ([bfa425e](https://github.com/i-christian/school_management_system/commit/bfa425efecf8a1b8aa2cfb2a0a276abd906a17e7)) - christian
- add new queries in `insights.sql` to get some data insights - ([fdf0342](https://github.com/i-christian/school_management_system/commit/fdf0342fde8930234864dc189ce42005a305d22c)) - christian
- improve academic years page to display a message indicating the absence of academic terms instead of an empty page - ([f0a9d09](https://github.com/i-christian/school_management_system/commit/f0a9d0962c73d397bd5f2898177c4e9c1b8b9263)) - christian
- improve students list page - ([2961b18](https://github.com/i-christian/school_management_system/commit/2961b181aaf41cbeec584532918ea6d71670a1bb)) - christian
- students report cards generation - ([be305e2](https://github.com/i-christian/school_management_system/commit/be305e28b681ea53be055943e95da8be9d7b02eb)) - christian
- enhance User Settings UX with password visibility toggle (removed section toggles) - ([6e9af9c](https://github.com/i-christian/school_management_system/commit/6e9af9c85830fa58745758193c6f38d9cfd87b2a)) - christian
- add a create footer function to generate userlist pdf functionality - ([111d60e](https://github.com/i-christian/school_management_system/commit/111d60ee4f89f024bf3002bfe4fcba2b0c02101d)) - christian

### Style

- **(reportcards)** add cursor pointer style on show button - ([cd92689](https://github.com/i-christian/school_management_system/commit/cd926896937c2920ad95002da3514143ae467e3c)) - christian
- **(sidebar)** default to a collapsed sidebar in default mode - ([6ebb07c](https://github.com/i-christian/school_management_system/commit/6ebb07c8af51f5920ab2570fd87dd2bc775c37a0)) - christian
- restructure and restyle create account form - ([27142bd](https://github.com/i-christian/school_management_system/commit/27142bd757a58217e5454149256042b885e7d7a9)) - christian
- update the application background color - ([1b4f3d6](https://github.com/i-christian/school_management_system/commit/1b4f3d64219215d09fc922678e219b04bfc8f5d2)) - christian
- improve the success modal UI - ([3ccf30d](https://github.com/i-christian/school_management_system/commit/3ccf30d9ed9f9d1552131f46d0c72b25a1cd5fd7)) - christian
- add a login button on landing page - ([89e8fe4](https://github.com/i-christian/school_management_system/commit/89e8fe4efe56f4bcc2dbb0a3585721dc0a3d6a8d)) - christian
- add cursor-pointer tailwind class on nav buttons in `myclasses` and `reportcards` pages - ([1a4a0f8](https://github.com/i-christian/school_management_system/commit/1a4a0f8e6728b7d408f9bc2c61181682d0dc2f10)) - christian
- improve `FeesList` page - ([ac800fc](https://github.com/i-christian/school_management_system/commit/ac800fc09141d6766ab66fddb6a0445c1dd9eb0b)) - christian

### Tests

- add unit tests for the homepage route - ([1e575c2](https://github.com/i-christian/school_management_system/commit/1e575c20cb1cad9ef22221ebdb012cbec2611b49)) - christian
- add expanded tests for routes and security headers - ([f593ea4](https://github.com/i-christian/school_management_system/commit/f593ea4e9acda3bfeceeb179a363b990acf3be65)) - christian
- implement authmiddleware tests - ([4e71dca](https://github.com/i-christian/school_management_system/commit/4e71dca607360addcce30c307402ee2407cb554c)) - christian
- add unit tests for cookies package - ([02fda4e](https://github.com/i-christian/school_management_system/commit/02fda4e95db1546e3e01004110064946c28504b8)) - christian
- Set up PostgreSQL container for tests and create integration test for login functionality - ([4d3da4a](https://github.com/i-christian/school_management_system/commit/4d3da4ac91143d77dd8e8ae48564c86708dae9f2)) - christian
- refactor test initialization and cleanup code to avoid repetition - ([f04f3e3](https://github.com/i-christian/school_management_system/commit/f04f3e3fa8865de859f80f1e713f6dfaed6e106a)) - christian
- Add integration test for user registration endpoint (POST /users/) - ([75ed658](https://github.com/i-christian/school_management_system/commit/75ed658e94132bce7dc010e66518901646eaf0cf)) - christian

### UI

- add userId fields to the User struct - ([ffc67f6](https://github.com/i-christian/school_management_system/commit/ffc67f68f4ccd0aeef95248d3fcf8ff662d11e4f)) - christian
- improve `EditComfirmation Modal` to have the same styling as `CreateUser Modal` - ([7128ec5](https://github.com/i-christian/school_management_system/commit/7128ec5317c030e5bb695159f13108e5570d16ad)) - christian
- improve success modal to handle deletion and updating users - ([9afe247](https://github.com/i-christian/school_management_system/commit/9afe247911584a2fbe9eda204f722089b2698b9f)) - christian
- improve forms to enable autocomplete - ([c3fc26a](https://github.com/i-christian/school_management_system/commit/c3fc26a46d5373ee1bbb4e5ed4bc4d3b3230272e)) - christian

### Ci

- upgrade go version used in `test.yml` workflow - ([ad08eeb](https://github.com/i-christian/school_management_system/commit/ad08eeb1e92026428472302ea5d2792da940e3c0)) - christian

<!-- generated by git-cliff -->
