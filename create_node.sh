#!/bin/bash

# Function to show help
show_help() {
    echo "Usage: $0 project_name [-t] [--neon] [--postgres] [--mysql] [--mongo] [--kibana] [--dbclient]"
    echo
    echo "Arguments:"
    echo "  project_name            The name of the Node.js backend project to create."
    echo
    echo "Options:"
    echo "  -t, --typescript        Initialize the project with TypeScript."
    echo "  --neon                  Include configuration for NeonDB."
    echo "  --postgres              Include configuration for PostgreSQL."
    echo "  --mysql                 Include configuration for MySQL."
    echo "  --mongo                 Include configuration for MongoDB."
    echo "  --kibana                Include configuration for Kibana/Elasticsearch."
    echo "  --dbclient              When using neon, specify the database client type (neon, pg or postgres)."
}

# Function to create the Node.js project
create_node_project() {
    local project_name=$1
    local typescript=$2
    
    echo "Creating Node.js backend project '$project_name' with ${typescript:-JavaScript}..."

    mkdir -p "projects/$project_name" || exit
    cd "projects/$project_name" || exit
    
    if [ "$typescript" == "--typescript" ]; then
        npm init -y
        npm install typescript @types/node ts-node --save-dev
        npx tsc --init
        return
    fi

    npm init -y

     npm install --save express dotenv helmet cors morgan
}

# Function to create the custom folder structure
create_folder_structure() {
    echo "Creating custom folder structure..."
    mkdir -p src/{controllers,models,routes,services,config,utils,middlewares,tests}
}

# Function to set up .gitignore
setup_gitignore() {
    echo "Setting up .gitignore..."
    echo "node_modules/" > .gitignore
    echo ".env" >> .gitignore
    echo "dist/" >> .gitignore
}

# Function to install dependencies
install_dependencies() {
    echo "Installing essential dependencies..."
    npm install express dotenv helmet cors morgan
}

# Function to update package.json
update_package_json() {
    echo "Updating package.json scripts..."
    
    # Add new scripts under "scripts" section
    sed -i.bak '/"scripts": {/a\
    \"start": "node src/server.js", \
    \"dbConnection": "node src/config/db.js",' package.json
    
    # Update the "main" entry point to "src/server.js"
    sed -i.bak 's/"main": "index.js"/"main": "src\/server.js"/' package.json
    
    # Clean up backup files
    rm package.json.bak
}

# Function to configure databases
configure_database() {
    local neon=$1
    local postgres=$2
    local mysql=$3
    local mongo=$4
    local kibana=$5

    if [ "$neon" == "true" ]; then
        npm install @neondatabase/serverless
        echo "NeonDB configuration added."
    fi
    if [ "$postgres" == "true" ]; then
        npm install pg
        echo "PostgreSQL configuration added."
    fi
    if [ "$mysql" == "true" ]; then
        npm install mysql2
        echo "MySQL configuration added."
    fi
    if [ "$mongo" == "true" ]; then
        npm install mongoose
        echo "MongoDB configuration added."
    fi
    if [ "$kibana" == "true" ]; then
        npm install @elastic/elasticsearch
        echo "Kibana/Elasticsearch configuration added."
    fi
}

# Function to create .env file
create_env_file() {
    local neon=$1
    local postgres=$2
    local mysql=$3
    local mongo=$4
    local kibana=$5
    local dbClientType=$6

    echo "Creating .env file..."

    cat <<EOL > .env
# Common settings
NODE_ENV=development
PORT=10000
EOL

    if [ "$neon" == "true" ]; then
        cat <<EOL >> .env
# NeonDB
NEON_ENDPOINT_ID=your_neon_db_url_here
DB_CLIENT=neon
EOL
    fi

    if [ "$postgres" == "true" ]; then
        cat <<EOL >> .env
# PostgreSQL
DB_CLIENT=postgres
EOL
    fi

    if [ "$postgres" == "true" ] || [ "$neon" == "true" ]; then
        cat <<EOL >> .env
PGHOST=your_postgres_host_here
PGPORT=5432
PGUSER=your_postgres_user_here
PGPASSWORD=your_postgres_password_here
PGDATABASE=your_postgres_database_here
EOL
    fi

    if [ "$mysql" == "true" ]; then
        cat <<EOL >> .env
# MySQL
MYSQL_HOST=your_mysql_host_here
MYSQL_PORT=3306
MYSQL_USER=your_mysql_user_here
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DATABASE=your_mysql_database_here
EOL
    fi

    if [ "$mongo" == "true" ]; then
        cat <<EOL >> .env
# MongoDB
MONGO_URI=your_mongodb_uri_here
MONGO_DB=your_mongodb_database_here
EOL
    fi

    if [ "$kibana" == "true" ]; then
        cat <<EOL >> .env
# Kibana/Elasticsearch
ELASTICSEARCH_HOST=your_elasticsearch_host_here
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_USER=your_elasticsearch_user_here
ELASTICSEARCH_PASSWORD=your_elasticsearch_password_here
EOL
    fi
}

# Function to create database connection files
create_connection_files() {
    echo "Creating database connection files..."
    local dbFile='';
    if [ "$1" == "true" ] || [ "$2" == "true" ]; then
        dbFile='postgres.js';
    fi
    if [ "$3" == "true" ]; then
        dbFile='mysql.js';
    fi
    if [ "$4" == "true" ]; then
        dbFile='mongo.js';
    fi
    if [ "$5" == "true" ]; then
        dbFile='elasticsearch.js';
    fi
    cp ../../config/baseFiles/${dbFile} src/config/db.js
}

# Function to create basic files
create_basic_files() {
    echo "Creating basic files..."
    cp ../../config/baseFiles/server.js src/server.js
    echo "Basic files created."
}

# Main function to set up the Node.js project
setup_node_project() {
    local project_name=$1
    local typescript=$2
    local neon=$3
    local postgres=$4
    local mysql=$5
    local mongo=$6
    local kibana=$7
    local dbclient=$8

    create_node_project "$project_name" "$typescript"
    create_folder_structure
    setup_gitignore
    install_dependencies "$typescript"
    configure_database "$neon" "$postgres" "$mysql" "$mongo" "$kibana"
    create_env_file "$neon" "$postgres" "$mysql" "$mongo" "$kibana" "$dbclient"
    create_basic_files "$typescript"
    create_connection_files "$neon" "$postgres" "$mysql" "$mongo" "$kibana"
    update_package_json
}

# Check if a project name was provided
if [ $# -lt 1 ]; then
    show_help
    exit 1
fi

# Parse command-line arguments
PROJECT_NAME=""
TYPESCRIPT=""
NEON="false"
POSTGRES="false"
MYSQL="false"
MONGO="false"
KIBANA="false"
DB_CLIENT=""
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--typescript)
        TYPESCRIPT="--typescript"
        shift
        ;;
        --neon)
        NEON="true"
        shift
        ;;
        --postgres)
        POSTGRES="true"
        shift
        ;;
        --mysql)
        MYSQL="true"
        shift
        ;;
        --mongo)
        MONGO="true"
        shift
        ;;
        --kibana)
        KIBANA="true"
        shift
        ;;
        --dbclient)
        DB_CLIENT="$2"
        shift 2
        ;;
        *)
        if [ -z "$PROJECT_NAME" ]; then
            PROJECT_NAME="$1"
        fi
        shift
        ;;
    esac
done

if [ -z "$PROJECT_NAME" ]; then
    show_help
    exit 1
fi

# Set up the Node.js project
setup_node_project "$PROJECT_NAME" "$TYPESCRIPT" "$NEON" "$POSTGRES" "$MYSQL" "$MONGO" "$KIBANA" "$DB_CLIENT"

# Completion message
echo "Node.js backend project '$PROJECT_NAME' successfully created with ${TYPESCRIPT:-JavaScript}, custom folder structure, database configurations, .env file, connection files, and optional configuration applied."
