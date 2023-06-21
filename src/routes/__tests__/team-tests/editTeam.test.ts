import request from "supertest";
import { app } from "../../../../app";

it("returns a 201 on successful team edit", async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/admin/signup") // Admin Signup Endpoint
    .send({
      email,
      password,
    })
    .expect(201);

  const token = response.body.userJwt;

  const response2 = await request(app)
    .post("/api/team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "test@test.com",
      league: "la liga",
      stadium: "test stadium",
      yearFounded: 2017,
    })
    .expect(201);

  const id = response2.body.team.id;

  const response3 = await request(app)
    .put(`/api/team/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "updated test FC",
      league: "la liga",
      stadium: "test stadium",
      yearFounded: 2017,
    })
    .expect(200);

  expect(response3.body.success).toBe(true);
  expect(response3.body.message).toBe("team edited");
});

it("returns a 400 with an empty field", async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/admin/signup") // Admin Signup Endpoint
    .send({
      email,
      password,
    })
    .expect(201);

  const token = response.body.userJwt;

  const response2 = await request(app)
    .post("/api/team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "test@test.com",
      league: "la liga",
      stadium: "test stadium",
      yearFounded: 2017,
    })
    .expect(201);

  const id = response2.body.id;

  const response3 = await request(app)
    .put(`/api/team/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      // name: "updated test FC",  --> missing input fields
      league: "la liga",
      stadium: "test stadium",
      yearFounded: 2017,
    })
    .expect(400);
  expect(response3.body).toStrictEqual({
    errors: [{ message: "Name must not be empty", field: "name" }],
  });
});

it("returns a 401 if user is not an admin", async () => {
  return request(app)
    .post("/api/team")
    .send({
      name: "test@test.com",
      league: "la liga",
      stadium: "test stadium",
      yearFounded: 2017,
    })
    .expect(401)
    .expect({
      success: false,
      status: 401,
      message: "NOT AUTHORIZED!",
    });
});
