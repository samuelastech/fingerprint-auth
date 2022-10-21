# Fingerprint Authenticator

It is a biometric authentication system by fingerprint written in JavaScript and Python. Each user must have their access level, which will restrain their access to some pieces of information. There are three levels: level 1 (everyone has access), level 2, and level 3.

There are two services:

`fingerprint-api` written in Python whose role is to take a fingerprint image, verify if it's really a fingerprint (instead of a car, bear, cat, plane...), find a match in the database, and return its corresponding user.

`users-api` written in JavaScript whose role is to register users, create sessions, and implement some authorization middlewares.
