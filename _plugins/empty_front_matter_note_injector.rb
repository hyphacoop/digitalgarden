# frozen_string_literal: true

front_matter_date = DateTime.now.strftime('%Y-%m-%d')

EMPTY_FRONT_MATTER = <<~JEKYLL
  ---
  date: #{front_matter_date}
  status: 🌱
  ---
JEKYLL

# Inject empty front matter in notes that don't have any
Jekyll::Hooks.register :site, :post_read do |site|
  Dir.glob("#{site.collections['notes'].relative_directory}/**/*.md").each do |filename|
    raw_note_content = File.read(filename)
    unless raw_note_content.start_with?('---')
      raw_note_content.prepend(EMPTY_FRONT_MATTER)
      File.write(filename, raw_note_content)
    end
  end
end
