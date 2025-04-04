//import org.example.dao.UserDao;
//import org.example.model.LoginDto;
//import org.example.model.RegisterUserDto;
//import org.example.model.User;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.transaction.annotation.Transactional;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//
//
//
//@SpringBootTest
//@AutoConfigureMockMvc
//@Transactional
//class AuthenticationTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private UserDao userDao;
//
//    @BeforeEach
//    void setUp() {
//        // Prepopulate the database with a test user
//        RegisterUserDto existingUser = new RegisterUserDto("existinguser", "password123", "existinguser@example.com");
//        userDao.createUser(existingUser);
//    }
//
//    @Test
//    void testLoginSuccess() throws Exception {
//        // Act & Assert
//        mockMvc.perform(post("/login")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"username\":\"existinguser\",\"password\":\"password123\"}"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.token").exists())
//                .andExpect(jsonPath("$.user.username").value("existinguser"));
//    }
//
//    @Test
//    void testLoginFailure() throws Exception {
//        // Act & Assert
//        mockMvc.perform(post("/login")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"username\":\"nonexistentuser\",\"password\":\"wrongpassword\"}"))
//                .andExpect(status().isUnauthorized());
//    }
//
//    @Test
//    void testRegisterSuccess() throws Exception {
//        // Act & Assert
//        mockMvc.perform(post("/register")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"username\":\"newuser\",\"password\":\"password123\",\"email\":\"newuser@example.com\"}"))
//                .andExpect(status().isCreated());
//    }
//
//    @Test
//    void testRegisterUserAlreadyExists() throws Exception {
//        // Act & Assert
//        mockMvc.perform(post("/register")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"username\":\"existinguser\",\"password\":\"password123\",\"email\":\"newemail@example.com\"}"))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string("User already exists."));
//    }
//
//    @Test
//    void testRegisterEmailAlreadyExists() throws Exception {
//        // Act & Assert
//        mockMvc.perform(post("/register")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"username\":\"newuser\",\"password\":\"password123\",\"email\":\"existinguser@example.com\"}"))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string("Email already exists."));
//    }
//
//    @Test
//    void testRegisterInvalidInput() throws Exception {
//        // Act & Assert
//        mockMvc.perform(post("/register")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"username\":\"\",\"password\":\"\",\"email\":\"\"}"))
//                .andExpect(status().isBadRequest());
//    }
//}