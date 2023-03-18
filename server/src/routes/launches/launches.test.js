const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
describe("Test POST /launches", () => {
   
  const completeLaunchData = {
    mission: "sdfs",
    rocket: "sgsag",
    target: "sfagag",
    launchDate: "December 5, 1908",
  };

  const launchDataWithoutDate = {
    mission: "sdfs",
    rocket: "sgsag",
    target: "sfagag",
  };

  const invalidData = {
    mission: "sdfs",
    rocket: "sgsag",
    target: "sfagag",
    launchDate: "zoot",
  };

  test("It should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(launchDataWithoutDate);
  });
  
  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "missing required launch properties",
    });
  });
  
  test("It should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(invalidData)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "inavlid launch date format",
    });
  });
});
