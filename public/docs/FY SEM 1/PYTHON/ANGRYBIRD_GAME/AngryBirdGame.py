import pygame, sys, random

def draw_floor():
    screen.blit(floor_surface, (floor_x_position, 900))
    screen.blit(floor_surface, (floor_x_position + 576, 900))

def create_pipe():
    random_pipe_position = random.choice(pipe_height)
    bottom_pipe = pipe_surface.get_rect(midtop=(700, random_pipe_position))
    top_pipe = pipe_surface.get_rect(midbottom=(700, random_pipe_position - 300))
    return bottom_pipe, top_pipe

def move_pipes(pipes):
    for pipe in pipes:
        pipe.centerx -= 3
    return pipes

def draw_pipes(pipes):
    for pipe in pipes:
        if pipe.bottom >= 1024:
            screen.blit(pipe_surface, pipe)
        else:
            flip_pipe = pygame.transform.flip(pipe_surface, False, True)
            screen.blit(flip_pipe, pipe)

def check_collision(pipes):
    for pipe in pipes:
        if bird_rectangle.colliderect(pipe):
            death_sound.play()
            return False
    if bird_rectangle.top <= -100 or bird_rectangle.bottom >= 900:
        return False
    return True

def rotate_bird(bird):
    new_bird = pygame.transform.rotozoom(bird, -bird_movement * 3, 1)
    return new_bird

def bird_animation():
    new_bird = bird_surface
    new_bird_rectangle = new_bird.get_rect(center=(100, bird_rectangle.centery))
    return new_bird, new_bird_rectangle

def score_display(game_state):
    if game_state == 'main_game':
        score_surface = game_font.render(str(int(score)), True, (255, 255, 255))
        score_rectangle = score_surface.get_rect(center=(288, 100))
        screen.blit(score_surface, score_rectangle)

    if game_state == 'game_over':
        score_surface = game_font.render(f'Score: {int(score)}', True, (255, 255, 255))
        score_rectangle = score_surface.get_rect(center=(288, 612))
        screen.blit(score_surface, score_rectangle)

        high_score_surface = game_font.render(f'High Score: {int(high_score)}', True, (255, 255, 255))
        high_score_rectangle = high_score_surface.get_rect(center=(288, 662))
        screen.blit(high_score_surface, high_score_rectangle)

def update_score(score, high_score):
    if score > high_score:
        high_score = score
        save_high_score(high_score)
    return high_score

def save_high_score(high_score):
    with open("highscore.txt", "w") as file:
        file.write(str(high_score))

def load_high_score():
    try:
        with open("highscore.txt", "r") as file:
            return int(file.read())
    except FileNotFoundError:
        return 0

def draw_bird_selection():
    # Draw selection text
    selection_text = game_font.render('Select Your Bird', True, (255, 255, 255))
    text_rect = selection_text.get_rect(center=(288, 200))
    screen.blit(selection_text, text_rect)
    
    # Draw all birds with their colored names
    for bird_name, bird_rect in bird_selection_rects.items():
        # Draw bird
        screen.blit(bird_images[bird_name], bird_rect)
        # Draw bird name with its corresponding color
        name_text = game_font.render(bird_name, True, bird_colors[bird_name])
        # Add black outline for yellow and white text to make them more visible
        if bird_name in ['YELLOW', 'WHITE']:
            outline_text = game_font.render(bird_name, True, (0, 0, 0))
            outline_rect = outline_text.get_rect(midleft=(bird_rect.right + 21, bird_rect.centery + 1))
            screen.blit(outline_text, outline_rect)
        name_rect = name_text.get_rect(midleft=(bird_rect.right + 20, bird_rect.centery))
        screen.blit(name_text, name_rect)

def draw_pipe_selection():
    # Draw selection text higher up with larger font
    selection_text = game_font.render('Select Pipe Color', True, (255, 255, 255))
    text_rect = selection_text.get_rect(center=(288, 150))  # Moved down a bit
    screen.blit(selection_text, text_rect)
    
    # Draw all pipes with their colored names
    text_positions = {'GREEN': 200, 'RED': 376}  # Adjusted text positions more to the left
    
    for pipe_name, pipe_rect in pipe_selection_rects.items():
        # First draw the name text at its fixed position
        name_text = game_font.render(pipe_name, True, pipe_colors[pipe_name])
        # Use separate text position
        name_rect = name_text.get_rect(center=(text_positions[pipe_name], 300))
        screen.blit(name_text, name_rect)
        
        # Then draw the pipe below
        screen.blit(pipe_selection_images[pipe_name], pipe_rect)

def create_button(text, y_pos):
    button_surface = game_font.render(text, True, (255, 255, 255))
    button_rect = button_surface.get_rect(center=(288, y_pos))
    return button_surface, button_rect

def draw_button(text, rect):
    # Draw button background
    pygame.draw.rect(screen, (70, 70, 70), rect.inflate(20, 10))
    pygame.draw.rect(screen, (100, 100, 100), rect.inflate(20, 10), 3)
    # Draw button text
    button_surface = game_font.render(text, True, (255, 255, 255))
    screen.blit(button_surface, rect)

# Initialize pygame
pygame.mixer.pre_init(frequency=44100, size=16, channels=1, buffer=512)
pygame.init()
screen = pygame.display.set_mode((576, 1024))
clock = pygame.time.Clock()
game_font = pygame.font.Font('./assets/04B_19.TTF', 40)

# Variables for the game
gravity = 0.25
bird_movement = 0
game_active = False
score = 0
high_score = load_high_score()  # Load high score at startup
game_started = False  # New variable to track if game has started
selecting_bird = True  # New variable for bird selection screen
selecting_pipe = False  # New variable for pipe selection screen
selected_bird = 'RED'  # Default bird
selected_pipe = 'GREEN'  # Default pipe

# Load all bird images
bird_images = {
    'RED': pygame.transform.scale(pygame.image.load('assets/bird.png').convert_alpha(), (68, 55)),
    'WHITE': pygame.transform.scale(pygame.image.load('assets/white.png').convert_alpha(), (68, 55)),
    'YELLOW': pygame.transform.scale(pygame.image.load('assets/yellow.png').convert_alpha(), (68, 55)),
    'BLACK': pygame.transform.scale(pygame.image.load('assets/black.png').convert_alpha(), (68, 55))
}

# Bird name colors
bird_colors = {
    'RED': (255, 0, 0),      # Red color
    'WHITE': (255, 255, 255), # White color
    'YELLOW': (255, 255, 0),  # Yellow color
    'BLACK': (0, 0, 0)        # Black color
}

# Create rectangles for bird selection - vertical arrangement
bird_selection_rects = {
    'RED': bird_images['RED'].get_rect(center=(200, 300)),
    'WHITE': bird_images['WHITE'].get_rect(center=(200, 400)),
    'YELLOW': bird_images['YELLOW'].get_rect(center=(200, 500)),
    'BLACK': bird_images['BLACK'].get_rect(center=(200, 600))
}

# Load pipe images
pipe_images = {
    'GREEN': pygame.transform.scale2x(pygame.image.load('assets/pipe-green.png').convert_alpha()),
    'RED': pygame.transform.scale2x(pygame.image.load('assets/pipe-red.png').convert_alpha())
}

# Create smaller versions for selection screen
pipe_selection_images = {
    'GREEN': pygame.transform.scale(pipe_images['GREEN'], (40, 160)),  # Much smaller size
    'RED': pygame.transform.scale(pipe_images['RED'], (40, 160))
}

pipe_colors = {
    'GREEN': (0, 255, 0),  # Green color
    'RED': (255, 0, 0)     # Red color
}

# Create rectangles for pipe selection - horizontal arrangement with more space between pipes
pipe_selection_rects = {
    'GREEN': pipe_images['GREEN'].get_rect(center=(230, 700)),  # Moved right
    'RED': pipe_images['RED'].get_rect(center=(406, 700))      # Moved right
}

# Background images for day and night
day_image = pygame.image.load('assets/bg.png').convert()
day_image = pygame.transform.scale2x(day_image)

night_image = pygame.image.load('assets/bg_night.png').convert()
night_image = pygame.transform.scale2x(night_image)

# Game surfaces
floor_surface = pygame.image.load('assets/base.png').convert()
floor_surface = pygame.transform.scale2x(floor_surface)
floor_x_position = 0

bird_surface = bird_images['RED']
bird_rectangle = bird_surface.get_rect(center=(100, 512))

BIRDFLAP = pygame.USEREVENT + 1
pygame.time.set_timer(BIRDFLAP, 200)

pipe_surface = pipe_images['GREEN']  # Default pipe surface
pipe_list = []
SPAWNPIPE = pygame.USEREVENT
pygame.time.set_timer(SPAWNPIPE, 1200)
pipe_height = [400, 600, 800]

game_over_surface = pygame.image.load('assets/gameover.png').convert_alpha()
game_over_surface = pygame.transform.scale2x(game_over_surface)
game_over_rectangle = game_over_surface.get_rect(center=(288, 412))

message_surface = pygame.transform.scale2x(pygame.image.load('assets/message2.png').convert_alpha())
message_rectangle = message_surface.get_rect(center=(288, 512))

flap_sound = pygame.mixer.Sound('sound/sfx_wing.wav')
death_sound = pygame.mixer.Sound('sound/sfx_hit.wav')
score_sound = pygame.mixer.Sound('sound/sfx_point.wav')
score_sound_countdown = 100

passed_pipe = False

# Background switching variables
background = day_image
last_switch_time = pygame.time.get_ticks()
switch_interval = 10000   # 10 seconds for each background (10,000 ms)
fade_duration = 10000  # 10 seconds fade duration

# Fade variables
fade_alpha_day = 255  # Initial alpha for the day image (fully visible)
fade_alpha_night = 0  # Initial alpha for the night image (fully transparent)
fade_direction = "day_to_night"  # Start with fading from day to night

# Create restart button
restart_text = 'RESTART'
restart_button_surface, restart_button_rect = create_button(restart_text, 750)

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.MOUSEBUTTONDOWN:
            mouse_pos = pygame.mouse.get_pos()
            
            if selecting_bird:
                # Check if a bird was clicked
                for bird_name, bird_rect in bird_selection_rects.items():
                    if bird_rect.collidepoint(mouse_pos):
                        selected_bird = bird_name
                        bird_surface = bird_images[bird_name]
                        selecting_bird = False
                        selecting_pipe = True  # Move to pipe selection after bird selection
                        
            elif selecting_pipe:
                # Pipe selection logic
                for pipe_name, pipe_rect in pipe_selection_rects.items():
                    if pipe_rect.collidepoint(mouse_pos):
                        selected_pipe = pipe_name
                        pipe_surface = pipe_images[pipe_name]
                        selecting_pipe = False
                        game_started = False  # Move to game start screen after pipe selection
            
            elif game_active:
                bird_movement = 0
                bird_movement -= 8
                flap_sound.play()
            else:
                if not game_started:
                    game_active = True
                    game_started = True
                    pipe_list.clear()
                    bird_rectangle.center = (100, 512)
                    bird_movement = 0
                    score = 0
                else:
                    # Any click on game over screen goes back to bird selection
                    selecting_bird = True
                    selecting_pipe = False
                    game_active = False
                    game_started = False
                    pipe_list.clear()
                    bird_movement = 0
                    score = 0

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                if game_active:
                    bird_movement = 0
                    bird_movement -= 8
                    flap_sound.play()
                else:
                    game_active = True
                    game_started = True  # Set game as started
                    pipe_list.clear()
                    bird_rectangle.center = (100, 512)
                    bird_movement = 0
                    score = 0

        if event.type == SPAWNPIPE:
            pipe_list.extend(create_pipe())

        if event.type == BIRDFLAP:
            bird_surface, bird_rectangle = bird_animation()

    # Check time for background change
    current_time = pygame.time.get_ticks()

    # Switch background every 10 seconds
    if current_time - last_switch_time >= switch_interval:
        last_switch_time = current_time  # Reset timer
        
        # Reverse fade direction
        if fade_direction == "day_to_night":
            fade_direction = "night_to_day"
        else:
            fade_direction = "day_to_night"

    # Apply the fade effect
    if fade_direction == "day_to_night":
        fade_alpha_day -= (255 / fade_duration) * clock.get_time()  # Fade out day
        fade_alpha_night += (255 / fade_duration) * clock.get_time()  # Fade in night
    else:
        fade_alpha_day += (255 / fade_duration) * clock.get_time()  # Fade in day
        fade_alpha_night -= (255 / fade_duration) * clock.get_time()  # Fade out night

    # Clamp the alpha values to ensure they stay within 0-255 range
    fade_alpha_day = max(0, min(255, fade_alpha_day))
    fade_alpha_night = max(0, min(255, fade_alpha_night))

    # Apply the alpha transparency to the backgrounds
    day_image.set_alpha(fade_alpha_day)
    night_image.set_alpha(fade_alpha_night)

    # Draw the background
    screen.blit(day_image, (0, 0))
    screen.blit(night_image, (0, 0))

    if selecting_bird:
        draw_bird_selection()
    elif selecting_pipe:
        draw_pipe_selection()
    elif game_active:
        # Bird
        bird_movement += gravity
        rotated_bird = rotate_bird(bird_surface)
        bird_rectangle.centery += bird_movement
        screen.blit(rotated_bird, bird_rectangle)

        # Pipes
        pipe_list = move_pipes(pipe_list)
        draw_pipes(pipe_list)

        # Check for scoring
        for pipe in pipe_list:
            if pipe.centerx == 100 and not passed_pipe:
                passed_pipe = True
                score += 1
                score_sound.play()

        if pipe_list and pipe_list[0].centerx < 0:
            passed_pipe = False

        # Check collision
        game_active = check_collision(pipe_list)
        score_display('main_game')
    else:
        high_score = update_score(score, high_score)
        if not game_started:  # Show welcome screen only if game hasn't started
            screen.blit(message_surface, message_rectangle)
        else:  # Show game over screen
            screen.blit(game_over_surface, game_over_rectangle)
            score_display('game_over')
            # Draw restart button
            draw_button(restart_text, restart_button_rect)

    floor_x_position -= 1
    draw_floor()
    if floor_x_position <= -576:
        floor_x_position = 0

    pygame.display.update()
    clock.tick(120)
