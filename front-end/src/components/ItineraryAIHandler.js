import axios from "axios";

const ItineraryAIHandler = {
  generateItinerary: async (city) => {
    const prompt = `Create a detailed 2-day travel itinerary for the city of ${city}. Include morning, afternoon, and evening activities for each day, along with brief descriptions of each activity. Return the response in valid JSON format with the following structure: { "day1": { "morning": "activity", "afternoon": "activity", "evening": "activity" }, "day2": { "morning": "activity", "afternoon": "activity", "evening": "activity" } }.Please return in json format and do not respond with leading backticks or json.`;

    const response = await axios.post(
      `http://localhost:9000/api/openai/fetch-response`,
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const rawContent = response.data.choices[0].message.content;

    try {
      // Parse the JSON part of the response
      return JSON.parse(rawContent);
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      throw new Error("Invalid JSON response from OpenAI");
    }
  },
};

export default ItineraryAIHandler;
