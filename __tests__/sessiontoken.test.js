import { NewSessionToken, GenerateSessionToken, tokenIsValid } from 'routes/sessionTokens.js';

beforeEach(() => {
    global.sessionStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
});

test("NewSessionToken creates a token if none exists", () => {
    sessionStorage.getItem.mockReturnValue(null); // Simulate no token in storage? HOPEFULLY??

    const userId = "user123";
    const token = NewSessionToken(userId);

    expect(sessionStorage.getItem).toHaveBeenCalledWith("sessionToken");
    expect(sessionStorage.setItem).toHaveBeenCalled();
    expect(token).toBeDefined();
});
 