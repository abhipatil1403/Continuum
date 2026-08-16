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
        score_rectangle = score_surface.get_rect(center=(288, 100))
        screen.blit(score_surface, score_rectangle)

        high_score_surface = game_font.render(f'High Score: {int(high_score)}', True, (255, 255, 255))
        high_score_rectangle = high_score_surface.get_rect(center=(288, 185))
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

# Background images for day and night
day_image = pygame.image.load('assets/bg.png').convert()
day_image = pygame.transform.scale2x(day_image)

night_image = pygame.image.load('assets/bg_night.png').convert()
night_image = pygame.transform.scale2x(night_image)

# Game surfaces
floor_surface = pygame.image.load('assets/base.png').convert()
floor_surface = pygame.transform.scale2x(floor_surface)
floor_x_position = 0

# Load and scale the bird image to match the size of the original
bird_surface = pygame.transform.scale(pygame.image.load('assets/bird.png').convert_alpha(), (68, 55))
bird_rectangle = bird_surface.get_rect(center=(100, 512))

BIRDFLAP = pygame.USEREVENT + 1
pygame.time.set_timer(BIRDFLAP, 200)

pipe_surface = pygame.image.load('assets/pipe-green.png')
pipe_surface = pygame.transform.scale2x(pipe_surface)
pipe_list = []
SPAWNPIPE = pygame.USEREVENT
pygame.time.set_timer(SPAWNPIPE, 1200)
pipe_height = [400, 600, 800]

game_over_surface = pygame.transform.scale2x(pygame.image.load('assets/message2.png').convert_alpha())
game_over_rectangle = game_over_surface.get_rect(center=(288, 512))

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

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                if game_active:
                    bird_movement = 0
                    bird_movement -= 8
                    flap_sound.play()
                else:
                    game_active = True
                    pipe_list.clear()
                    bird_rectangle.center = (100, 512)
                    bird_movement = 0
                    score = 0

        if event.type == pygame.MOUSEBUTTONDOWN:
            if game_active:
                bird_movement = 0
                bird_movement -= 8
                flap_sound.play()
            else:
                game_active = True
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

    if game_active:
        bird_movement += gravity
        rotated_bird = rotate_bird(bird_surface)
        bird_rectangle.centery += bird_movement
        screen.blit(rotated_bird, bird_rectangle)
        game_active = check_collision(pipe_list)

        pipe_list = move_pipes(pipe_list)
        draw_pipes(pipe_list)

        for pipe in pipe_list:
            if pipe.centerx == 100 and not passed_pipe:
                passed_pipe = True
                score += 1
                score_sound.play()

        if pipe_list and pipe_list[0].centerx < 0:
            passed_pipe = False

        score_display('main_game')

    else:
        screen.blit(game_over_surface, game_over_rectangle)
        high_score = update_score(score, high_score)
        score_display('game_over')

    floor_x_position -= 1
    draw_floor()
    if floor_x_position <= -576:
        floor_x_position = 0

    pygame.display.update()
    clock.tick(120)
