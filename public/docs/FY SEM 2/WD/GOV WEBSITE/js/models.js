// Base Event class
class Event {
    constructor(id, name, date, location, description, imageUrl) {
        this.id = id;
        this.name = name;
        this.date = new Date(date);
        this.location = location;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    get formattedDate() {
        return this.date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    get daysUntil() {
        const today = new Date();
        const diffTime = this.date - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

// Sport-specific event classes
class CricketEvent extends Event {
    constructor(id, name, date, location, description, imageUrl, teams, matchType) {
        super(id, name, date, location, description, imageUrl);
        this.teams = teams;
        this.matchType = matchType;
    }

    get matchDetails() {
        return `${this.teams.join(' vs ')} - ${this.matchType}`;
    }
}

class AthleticsEvent extends Event {
    constructor(id, name, date, location, description, imageUrl, categories) {
        super(id, name, date, location, description, imageUrl);
        this.categories = categories;
    }

    get eventCategories() {
        return this.categories.join(', ');
    }
}

// Athlete class
class Athlete {
    constructor(id, name, sport, achievements, imageUrl, bio) {
        this.id = id;
        this.name = name;
        this.sport = sport;
        this.achievements = achievements;
        this.imageUrl = imageUrl;
        this.bio = bio;
    }

    get achievementCount() {
        return this.achievements.length;
    }

    get latestAchievement() {
        return this.achievements[0];
    }
}

// News class
class News {
    constructor(id, title, content, date, imageUrl, category) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.date = new Date(date);
        this.imageUrl = imageUrl;
        this.category = category;
    }

    get formattedDate() {
        return this.date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    get excerpt() {
        return this.content.substring(0, 150) + '...';
    }
}

// Team class
class Team {
    constructor(id, name, sport, players, achievements) {
        this.id = id;
        this.name = name;
        this.sport = sport;
        this.players = players;
        this.achievements = achievements;
    }

    get playerCount() {
        return this.players.length;
    }

    get achievementCount() {
        return this.achievements.length;
    }
}

// Match class
class Match {
    constructor(id, eventId, team1, team2, date, venue, status) {
        this.id = id;
        this.eventId = eventId;
        this.team1 = team1;
        this.team2 = team2;
        this.date = new Date(date);
        this.venue = venue;
        this.status = status;
        this.score = {
            team1: 0,
            team2: 0
        };
    }

    updateScore(team1Score, team2Score) {
        this.score.team1 = team1Score;
        this.score.team2 = team2Score;
    }

    get winner() {
        if (this.status !== 'completed') return null;
        return this.score.team1 > this.score.team2 ? this.team1 : this.team2;
    }
}

// Export classes for use in other files
export {
    Event,
    CricketEvent,
    AthleticsEvent,
    Athlete,
    News,
    Team,
    Match
}; 