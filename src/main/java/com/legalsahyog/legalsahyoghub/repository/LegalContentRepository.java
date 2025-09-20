package com.legalsahyog.legalsahyoghub.repository;

import com.legalsahyog.legalsahyoghub.entity.LegalContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LegalContentRepository extends JpaRepository<LegalContent, Long> {
    
    List<LegalContent> findByIsPublishedTrue();
    
    List<LegalContent> findByContentType(LegalContent.ContentType contentType);
    
    List<LegalContent> findByCategory(String category);
    
    List<LegalContent> findByIsPublishedTrueAndContentType(LegalContent.ContentType contentType);
    
    @Query("SELECT lc FROM LegalContent lc WHERE lc.isPublished = true AND (lc.title LIKE %:keyword% OR lc.content LIKE %:keyword%)")
    List<LegalContent> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT lc FROM LegalContent lc WHERE lc.isPublished = true ORDER BY lc.viewCount DESC")
    List<LegalContent> findMostViewedContent();
}
