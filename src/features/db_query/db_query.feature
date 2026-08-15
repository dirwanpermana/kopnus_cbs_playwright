# Feature: Database query via DB helper

# @db_query
#   Scenario: Verify DB connection and select current database
#     Given database connection is ready
#     When I query the users table by NIK Odoo
#     Then the result should contain a matching user row
