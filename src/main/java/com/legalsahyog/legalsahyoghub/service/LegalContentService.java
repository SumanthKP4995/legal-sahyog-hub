package com.legalsahyog.legalsahyoghub.service;

import com.legalsahyog.legalsahyoghub.entity.LegalContent;
import com.legalsahyog.legalsahyoghub.repository.LegalContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LegalContentService {
    
    @Autowired
    private LegalContentRepository legalContentRepository;
    
    public List<LegalContent> getAllContent() {
        return legalContentRepository.findAll();
    }
    
    public List<LegalContent> getPublishedContent() {
        return legalContentRepository.findByStatusOrderByCreatedAtDesc(LegalContent.ContentStatus.PUBLISHED);
    }
    
    public List<LegalContent> getContentByType(LegalContent.ContentType contentType) {
        return legalContentRepository.findByContentTypeAndStatusOrderByCreatedAtDesc(contentType, LegalContent.ContentStatus.PUBLISHED);
    }
    
    public List<LegalContent> getContentByCategory(String category) {
        return legalContentRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, LegalContent.ContentStatus.PUBLISHED);
    }
    
    public List<LegalContent> searchContent(String keyword) {
        return legalContentRepository.findByKeywordAndStatus(keyword, LegalContent.ContentStatus.PUBLISHED);
    }
    
    public List<LegalContent> getFeaturedContent() {
        return legalContentRepository.findByIsFeaturedTrueAndStatusOrderByCreatedAtDesc(LegalContent.ContentStatus.PUBLISHED);
    }
    
    public List<LegalContent> getPopularContent() {
        return legalContentRepository.findByStatusOrderByViewCountDesc(LegalContent.ContentStatus.PUBLISHED);
    }
    
    public Optional<LegalContent> getContentById(Long id) {
        Optional<LegalContent> content = legalContentRepository.findById(id);
        if (content.isPresent()) {
            // Increment view count
            LegalContent legalContent = content.get();
            legalContent.setViewCount(legalContent.getViewCount() + 1);
            legalContentRepository.save(legalContent);
        }
        return content;
    }
    
    public LegalContent createContent(LegalContent content) {
        content.setViewCount(0);
        content.setStatus(LegalContent.ContentStatus.DRAFT);
        return legalContentRepository.save(content);
    }
    
    public LegalContent updateContent(Long id, LegalContent contentDetails) {
        Optional<LegalContent> contentOptional = legalContentRepository.findById(id);
        if (contentOptional.isPresent()) {
            LegalContent content = contentOptional.get();
            content.setTitle(contentDetails.getTitle());
            content.setContent(contentDetails.getContent());
            content.setSummary(contentDetails.getSummary());
            content.setCategory(contentDetails.getCategory());
            content.setTags(contentDetails.getTags());
            content.setContentType(contentDetails.getContentType());
            content.setIsFeatured(contentDetails.getIsFeatured());
            return legalContentRepository.save(content);
        }
        throw new RuntimeException("Content not found with id: " + id);
    }
    
    public LegalContent publishContent(Long id) {
        Optional<LegalContent> contentOptional = legalContentRepository.findById(id);
        if (contentOptional.isPresent()) {
            LegalContent content = contentOptional.get();
            content.setStatus(LegalContent.ContentStatus.PUBLISHED);
            return legalContentRepository.save(content);
        }
        throw new RuntimeException("Content not found with id: " + id);
    }
    
    public LegalContent unpublishContent(Long id) {
        Optional<LegalContent> contentOptional = legalContentRepository.findById(id);
        if (contentOptional.isPresent()) {
            LegalContent content = contentOptional.get();
            content.setStatus(LegalContent.ContentStatus.DRAFT);
            return legalContentRepository.save(content);
        }
        throw new RuntimeException("Content not found with id: " + id);
    }
    
    public void deleteContent(Long id) {
        legalContentRepository.deleteById(id);
    }
    
    public List<String> getAllCategories() {
        return legalContentRepository.findDistinctCategories();
    }
    
    public List<String> getAllTags() {
        return legalContentRepository.findDistinctTags();
    }
}
